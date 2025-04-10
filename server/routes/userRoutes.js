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

    // Calculate new rating
    const totalRatingPoints = (user.rating * user.ratingCount) + newRating;
    const newRatingCount = user.ratingCount + 1;
    const updatedRating = Number((totalRatingPoints / newRatingCount).toFixed(2));
    
    // Update user's rating and count
    user.rating = updatedRating;
    user.ratingCount = newRatingCount;
    
    await user.save();
    
    res.json({ 
      message: "Rating updated successfully.", 
      user: {
        abcId: user.abcId,
        rating: user.rating,
        ratingCount: user.ratingCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating rating." });
  }
});

module.exports = router;