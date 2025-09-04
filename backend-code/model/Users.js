const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
});

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;

// In your main server file (e.g., index.js), you would use this model as follows:
// const UserModel = require('./model/Users');
// app.post('/register', async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;
//   try {
//     const newUser = new UserModel({ firstName, lastName, email, password });
//     await newUser.save();
//     res.status(201).send('User registered successfully');
//   } catch (error) {
//     res.status(400).send('Error registering user: ' + error.message);
//   }
// });