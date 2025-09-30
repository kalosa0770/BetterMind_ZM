const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const UserModel = require('../models/Users');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

// In-memory set for revoked tokens. In a production app, you would use a persistent store like Redis.
const revokedTokens = new Set();

// Registration route
router.post('/register',
  [
    body('email').isEmail().withMessage('Invalid email address.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
      .matches(/[A-Z]/).withMessage('Password must contain at least 1 uppercase letter.')
      .matches(/[a-z]/).withMessage('Password must contain at least 1 lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least 1 number.')
      .matches(/[!@#$%&*?]/).withMessage('Password must contain at least 1 special character.'),
    // We are using a custom validator with a regex to ensure the number is in E.164 format.
    body('phoneNumber').custom((value) => {
      // E.164 format regex: starts with a +, followed by 1 to 15 digits.
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      if (!e164Regex.test(value)) {
        throw new Error('Invalid phone number. It must be in E.164 format, e.g., +260770940809');
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { firstName, lastName, email, phoneNumber, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // The password will be hashed automatically by the pre-save hook in the user model
      const newUser = await UserModel.create({
        firstName,
        lastName,
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
        twoFactorSecret: null,
      });

      res.status(201).json({ msg: 'User registered successfully', userId: newUser._id });
    } catch (err) {
      // The updated logging will show the exact error that is causing the crash
      logger.error(`Registration server error: ${err.message}`, { stack: err.stack });
      res.status(500).json({ msg: 'Server error. Please try again later.' });
    }
  });

// Login Limiter
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Login route
router.post('/login', loginLimit, async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(401).json({ message: 'Email address and Password are required' });
    }

    const user = await UserModel.findOne({ email });

    // Handle unknown user
    if (!user) {
      logger.warn(`Failed login attempt for unknown user with email: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check if user account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      logger.warn(`Locked account login attempt for user with email: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Account is locked. Please try again later.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (isMatch) {
      // Successful login
      await UserModel.updateOne({ _id: user._id }, { loginAttempts: 0, lockUntil: undefined });
      
      // Direct login since 2FA is disabled
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Authentication successful!',
        token,
        twoFactorRequired: false
      });
    } else {
      // Failed login attempt, increment attempts and potentially lock account
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        { $inc: { loginAttempts: 1 } },
        { new: true }
      );

      const maxAttempts = 5;
      const lockTime = 15 * 60 * 1000;

      if (updatedUser.loginAttempts >= maxAttempts) {
        const lockUntil = Date.now() + lockTime;
        await UserModel.updateOne({ _id: updatedUser._id }, { lockUntil });
        logger.error(`Account locked for user with email: ${email} after ${maxAttempts} failed attempts.`);
        return res.status(401).json({ message: 'Too many failed login attempts. Your account is locked. Try again later.' });
      }

      logger.warn(`Failed login attempt for user with email: ${email} with invalid password. Attempts: ${updatedUser.loginAttempts} / ${maxAttempts}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

  } catch (error) {
    logger.error(`Server error during login for user with email: ${email}. Error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    // This is a security best practice: always respond with a generic message
    // to prevent email enumeration attacks, regardless of if the user exists.
    if (!user) {
      return res.status(200).json({ message: 'If a matching account is found, a password reset link has been sent to your email.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expirationToken = Date.now() + 3600000; // 1 hour

    await UserModel.updateOne({ _id: user._id }, { resetToken: hashedToken, resetTokenExpiration: expirationToken });

    const transporter = nodemailer.createTransport({/* email configuration here */ });
    const resetUrl = `https://bettermindzm.com/reset-password?token=${resetToken}&id=${user._id}`;

    await transporter.sendMail({
      from: 'noreply@bettermindzm.com',
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    res.status(200).json({ message: 'If a matching account is found, a password reset link has been sent to your email.' });
  } catch (error) {
    logger.error("Forgot password server error:", error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// reset password route endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;
    const user = await UserModel.findById(userId);

    if (!user || !user.resetToken) {
      return res.status(400).json({ message: 'Invalid or expired password reset link.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    if (hashedToken !== user.resetToken || user.resetTokenExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired password reset link.' });
    }

    const salt = await bcrypt.genSalt(12);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: 'You have successfully changed your password.' });

  } catch (error) {
    logger.error("Reset password server error:", error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// New Logout Route
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    revokedTokens.add(token);
    return res.status(200).json({ message: 'Logout successful.' });
  }
  return res.status(400).json({ message: 'No token provided.' });
});

// New protected route
router.get('/protected', protect, (req, res) => {
  res.status(200).json({
    message: 'You have accessed a protected route!',
    data: {
      user: 'Super Secure User',
      info: 'This data is only available to authenticated users.'
    }
  });
});

module.exports = router;