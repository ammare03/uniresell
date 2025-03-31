// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Existing endpoint to get user details (if you have it):
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

// New endpoint to update user rating
router.post('/users/:abcId/rate', async (req, res) => {
  try {
    const { newRating } = req.body;
    if (typeof newRating !== 'number' || newRating < 1 || newRating > 5) {
      return res.status(400).json({ message: "Invalid rating value." });
    }
    
    const user = await User.findOne({ abcId: req.params.abcId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Calculate updated rating
    const currentTotal = (user.rating || 0) * (user.ratingCount || 0);
    const updatedCount = (user.ratingCount || 0) + 1;
    const updatedRating = (currentTotal + newRating) / updatedCount;
    
    user.rating = updatedRating;
    user.ratingCount = updatedCount;
    
    await user.save();
    
    res.json({ message: "Rating updated successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating rating." });
  }
});

module.exports = router;