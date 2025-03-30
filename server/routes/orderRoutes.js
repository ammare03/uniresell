const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_l3iiBr281IE9vB',  // Replace with your Razorpay key
  key_secret: 'bmJMT1Rup2X28bQkGQkv0rZ3',  // Replace with your Razorpay secret
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body; // The amount from the frontend, in paisa (₹1 = 100 paisa)
  
  // Create Razorpay order
  const options = {
    amount: amount * 100,  // Convert to paisa
    currency: 'INR',
    receipt: `order_rcptid_${Math.random()}`, // Unique order receipt
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      order_id: order.id,
      amount: order.amount / 100, // Convert amount back to rupees for frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order with Razorpay.');
  }
});

module.exports = router;