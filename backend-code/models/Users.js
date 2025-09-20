const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: 6,
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: {
    type: Number,
    required: false,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  // Add the new field to store the permanent secret for 2FA
  twoFactorSecret: {
    type: String,
    required: true,
  },
  // We can remove the old otp and otpExpires fields
  otp: {
    type: String,
    required: false,
  },
  otpExpires: {
    type: Number,
    required: false,
  },
});

// Password hashing middleware using a pre-save hook
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;