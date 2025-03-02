// server/routes/ads.js
const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

// Create a new ad
router.post('/ads', async (req, res) => {
  try {
    const { title, description, price, image, postedBy } = req.body;
    if (!title || !description || !price || !image || !postedBy) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const ad = new Ad({ title, description, price, image, postedBy });
    await ad.save();
    res.status(201).json({ message: "Ad created successfully.", ad });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({ message: "Server error while creating ad." });
  }
});

// Get all ads
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.status(200).json({ ads });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ message: "Server error while fetching ads." });
  }
});

// Get a single ad by id
router.get('/ads/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found." });
    }
    res.status(200).json({ ad });
  } catch (error) {
    console.error("Error fetching ad:", error);
    res.status(500).json({ message: "Server error while fetching ad." });
  }
});

module.exports = router;