// server/routes/ads.js
const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

// Get all ads
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json({ ads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new ad
router.post('/', async (req, res) => {
  try {
    // Debug logs
    console.log('Received ad creation request with body:', {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      postedBy: req.body.postedBy,
      hasImage: !!req.body.image
    });

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'image', 'postedBy'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const ad = new Ad({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      postedBy: req.body.postedBy,
      category: req.body.category
    });

    console.log('Creating new ad with data:', {
      title: ad.title,
      description: ad.description,
      price: ad.price,
      postedBy: ad.postedBy,
      hasImage: !!ad.image
    });

    const newAd = await ad.save();
    console.log('Ad created successfully with ID:', newAd._id);
    
    res.status(201).json({ ad: newAd });
  } catch (err) {
    console.error('Error creating ad:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get specific ad
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.json({ ad });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update ad
router.put('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (req.body.title) ad.title = req.body.title;
    if (req.body.description) ad.description = req.body.description;
    if (req.body.price) ad.price = req.body.price;
    if (req.body.image) ad.image = req.body.image;
    if (req.body.category) ad.category = req.body.category;
    if (req.body.sold !== undefined) ad.sold = req.body.sold;
    if (req.body.soldTo) ad.soldTo = req.body.soldTo;

    const updatedAd = await ad.save();
    res.json({ ad: updatedAd });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete ad
router.delete('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    await ad.remove();
    res.json({ message: 'Ad deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;