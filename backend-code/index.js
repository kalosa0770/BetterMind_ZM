const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./model/Users');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/bettermind_zm');

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email})
  .then(user => {
    if (user) {
      if (password === user.password) {
        res.json("Success");
      }else {
        res.json("Password did not match");
      }
    } else {
      res.json("User not registered");
    }
  })
})


app.post('/register', (req, res) => {
  UserModel.create(req.body)
  .then(users => res.json(users))
  .catch(err => res.json(err));
})

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});