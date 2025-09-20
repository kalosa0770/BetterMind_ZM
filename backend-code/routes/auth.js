const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const twilio = require('twilio');
const UserModel = require('../models/Users');
const { body, validationResult } = require('express-validator');

// Twilio credentials from your Twilio Console
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

const twilioClient = new twilio(accountSid, authToken);

// Speakeasy secret key management - this should be generated ONCE per user
const generateSecret = () => {
  return speakeasy.generateSecret({ length: 20 });
};

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

      // Generate a permanent secret for this user's 2FA
      const twoFactorSecret = generateSecret().base32;

      // The password will be hashed automatically by the pre-save hook in the user model
      const newUser = await UserModel.create({
        firstName,
        lastName,
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
        twoFactorSecret, // Save the permanent secret with the user
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

  // --- ADD THESE LOGS ---
  console.log('Attempting login with email:', email);
  console.log('Password received:', password);

  try {
    if (!email || !password) {
      return res.status(401).json({ message: 'Email address and Password are required' });
    }

    const user = await UserModel.findOne({ email });

    // --- ADD THIS LOG ---
    console.log('Found user:', user);

    // Handle unknown user
    if (!user) {
      logger.warn(`Failed login attempt for unknown user with email: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

     // --- ADD THESE LOGS ---
    console.log('Provided password:', password);
    console.log('Hashed password from database:', user.password);

    // Check if user account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      logger.warn(`Locked account login attempt for user with email: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Account is locked. Please try again later.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    // --- ADD THIS LOG ---
    console.log('Password comparison result (isMatch):', isMatch);

    if (isMatch) {
      // Successful login, now initiate 2FA
      await UserModel.updateOne({ _id: user._id }, { loginAttempts: 0, lockUntil: undefined });
      
      // Use the permanent secret to generate the OTP
      const token = speakeasy.totp({
        secret: user.twoFactorSecret, // Use the secret from the database
        encoding: 'base32',
        digits: 6,
      });

      console.log('Generated OTP:', token);

      // Send the OTP via Twilio SMS
      try {
        console.log(`Sending SMS from: ${twilioNumber} to: ${user.phoneNumber}`);
        await twilioClient.messages.create({
          body: `Your OTP is: ${token}. It expires in 10 minutes.`,
          to: user.phoneNumber,
          from: twilioNumber,
        });

        res.status(200).json({
          message: 'OTP sent to your phone number. Please verify to continue.',
          userId: user._id,
        });
      } catch (twilioError) {
        // Log the full error object for better debugging
        logger.error("Twilio SMS send error:", twilioError);
        res.status(500).json({ message: "Failed to send OTP. Please try again." });
      }

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

// OTP Verification Route
router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Use the speakeasy library's built-in verification method
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otp,
      window: 1, // Allow for one 30-second window before/after the current time
    });

    if (verified) {
      // Generate a JWT for the authenticated user
      const payload = {
        id: user.id,
        username: user.username
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send the JWT to the client
      res.status(200).json({
        message: 'Authentication successful!',
        token
      });

    } else {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({ message: 'An error occurred during OTP verification.' });
  }
});

module.exports = router;