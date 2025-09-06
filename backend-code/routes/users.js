const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const UserModel = require('../models/Users');

router.get('/my-initials', protect, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('firstName lastName');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const firstNameInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastNameInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    const initials = `${firstNameInitial}${lastNameInitial}`;

    res.json({ initials });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;