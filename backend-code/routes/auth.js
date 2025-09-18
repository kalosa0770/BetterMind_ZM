const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const UserModel = require('../models/Users');
const { error } = require('winston');
const { body, validationResult } = require('express-validator');

// Registration route
router.post('/register',
  [
    body('email').isEmail().withMessage('Invalid email address.').normalizeEmail(), // Added normalizeEmail()
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.') 
    .matches(/[A-Z]/).withMessage('Password must contain at least 1 uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain at least 1 lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least 1 number.')
    .matches(/[!@#$%&*?]/).withMessage('Password must contain at least 1 special character.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { firstName, lastName, email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      
      // The password will be hashed automatically by the pre-save hook in the user model
      const newUser = await UserModel.create({
        firstName,
        lastName,
        email: email.trim(),
        password: password.trim()
      });

      res.status(201).json({ msg: 'User registered successfully', userId: newUser._id });
    } catch (err) {
        // Log the full error to your secure logging system
        logger.error(`Registration server error: ${err.message}`, { stack: err.stack }); 
        // Return a generic error message to the client
        res.status(500).json({ msg: 'Server error. Please try again later.' });
    }
  });

// Login Limiter 
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes trying to access the account
  max: 5, // Maximum of 5 attempts
  message: 'Too many login attempts tried, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// lock out the account
const maxAttempts = 5;
const lockTime = 15 * 60 * 1000;

// Login route
router.post('/login', loginLimit, async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      return res.status(401).json({ message: 'Email address and Password are required' });
    }

    // finding the registered user by email address
    const user = await UserModel.findOne({ email });

    // logging a failed attempt for an unknown user
    if (!user) {
      logger.warn(`Failed login attempt for unknown user with email: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // checking if user account is locked
    if (user.isLocked) {
      logger.warn(`Locked account login attempt for user with email: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Account is Locked. Please try again later.' });
    }

    // comparing the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (isMatch) {
      // On a successful login attempt
      await UserModel.updateOne({ id: user._id }, {loginAttempts: 0});
      // a successful login message
      logger.info(`Successful login for user with email: ${email} from IP: ${req.ip}`);

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName } });
    } else {
      // On a failed login attempt
      await UserModel.updateOne({ id: user._id }, {$inc: {loginAttempts: 1 } });
      const updateUser = await UserModel.findOne({ email });

      if ( updateUser.loginAttempts >= maxAttempts) {
        const lockUntil = Date.now() + lockTime;
        await UserModel.updateOne({ id: user._id }, {lockUntil});

        logger.error(`Account locked for user with email: ${email} after ${maxAttempts} failed attempts.`);
        return res.status(401).json({ message: 'Too many failed login attempts. Your account is locked. Try again later.' });
      }
    }

    // logging a failed attemp for an unknown user with an incorrect password
    logger.warn(`Failed login attempt for user with email: ${email} with invalid password from IP: ${req.ip}. 
                    Attempts: ${updateUser.loginAttempts} / ${maxAttempts}`);
    return res.status(401).json({ message: 'Invalid credentials.' });

  } catch (error) {

    //logging any server errors
    logger.error(`Server error during login for user with email: ${email}. Error: ${error.message}`, {stack: error.stack});
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// forgot password route
router.post('/forgot-password', async (req, res) => {

  try {

    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: 'If a matching account is found, a password reset link has been sent to your email.'});
    }

    // A secure token Generation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expirationToken = Date.now() + 3600000; // 1 hour

    await UserModel.updateOne({ id: user._id }, { resetToken: hashedToken, resetTokenExpiration: expirationToken });

    // Sending the email with plain text token
    const transporter = nodemailer.createTransport({/* email configuration here */});
    const resetUrl = `https://bettermindzm.com/reset-password?token=${resetToken}&id=${user._id}`;

    await transporter.sendMail({
      from: 'noreply@bettermindzm.com',
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requsted a password reset. Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    res.status(200).json({ message: 'If a matching account is found, a password reset link has been sent to your email.' });
  } catch (error) {
    // logging the error for server-side monitoring
    console.error(error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});


// reset password route endpoint

router.post('/reset-password', async (req, res) => {

  try {
    const { userId, token, newPassword } = req.body;
    const user = await UserModel.findById(userId);

    if (!user || !user.resetToken) {
      return res.status(400).json({ message: 'Invalid or expired password reset link.'});
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    if (hashedToken !== user.resetToken || user.resetTokenExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired password reset link.'});
    }

    const salt = await bcrypt.genSalt(12);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: 'You have successfully changed your password.' }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'an error occured. Please try again later.'})
  }
  
});

module.exports = router;
