const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/Users');

// Registration route
router.post('/register', async (req, res) => {
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
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // LOGGING 1: Log the details of the incoming request
  console.log('Login attempt received:', { email, password });

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // LOGGING 2: Show the data before comparison
    console.log('User found:', user.email);
    console.log('Comparing passwords:', {
      provided: password,
      stored: user.password
    });

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    // NEW LOGGING: Log the result of the bcrypt comparison
    console.log('bcrypt.compare result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
