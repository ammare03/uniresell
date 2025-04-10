const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Ad = require('../models/Ad');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { adId, buyerId, sellerId } = req.body;
    
    // Get ad details
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Create order with ad details
    const order = new Order({
      adId,
      buyerId,
      sellerId,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      image: ad.image
    });

    // Mark the ad as sold
    ad.sold = true;
    ad.soldTo = buyerId;
    await ad.save();

    // Save the order
    await order.save();
    
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders by buyer ID (order history)
router.get('/buyer/:abcId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.abcId })
      .sort({ purchaseDate: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders by seller ID (sell history)
router.get('/seller/:abcId', async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.abcId })
      .sort({ purchaseDate: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 