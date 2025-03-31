// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users/:abcId', async (req, res) => {
  try {
    const user = await User.findOne({ abcId: req.params.abcId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;