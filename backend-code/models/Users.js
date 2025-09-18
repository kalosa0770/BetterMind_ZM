const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    loginAttempts: { 
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: {
        type: Number
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Number
    }
});

userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Mongoose pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);  
    }
    next();    
});

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;
