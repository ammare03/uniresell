const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const router = express.Router();
const Ad = require('../models/Ad');
const User = require('../models/User');
const Order = require('../models/Order');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_l3iiBr281IE9vB',
  key_secret: 'bmJMT1Rup2X28bQkGQkv0rZ3'
});

// Create Order
router.post('/create-order', async (req, res) => {
  try {
    console.log('Create order request:', req.body);
    const { amount, adId, buyerId } = req.body;

    if (!amount || !adId || !buyerId) {
      console.log('Missing required fields:', { amount, adId, buyerId });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify ad exists and is not sold
    const ad = await Ad.findById(adId);
    if (!ad) {
      console.log('Ad not found:', adId);
      return res.status(404).json({ message: 'Ad not found' });
    }
    if (ad.sold) {
      console.log('Ad already sold:', adId);
      return res.status(400).json({ message: 'This item has already been sold' });
    }
    if (ad.postedBy === buyerId) {
      console.log('Attempted to buy own ad:', { adId, buyerId });
      return res.status(400).json({ message: 'You cannot buy your own ad' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    if (!order || !order.id) {
      console.error('Invalid order response from Razorpay:', order);
      return res.status(500).json({ message: 'Failed to create payment order' });
    }

    res.json({
      status: 'success',
      order_id: order.id,
      amount: options.amount,
      currency: options.currency
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message || 'Error creating order'
    });
  }
});

// Verify Payment Signature
router.post('/verify-payment', async (req, res) => {
  console.log('Payment verification request received:', req.body);
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      adId, 
      buyerId,
      amount 
    } = req.body;

    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !adId || !buyerId) {
      console.error('Missing required parameters:', req.body);
      return res.status(400).json({ 
        status: 'failure', 
        message: 'Missing required parameters' 
      });
    }

    try {
      // Verify signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generated_signature = crypto
        .createHmac('sha256', razorpay.key_secret)
        .update(text)
        .digest('hex');
      
      console.log('Signature verification:', {
        provided: razorpay_signature,
        generated: generated_signature,
        match: generated_signature === razorpay_signature
      });

      const isSignatureValid = generated_signature === razorpay_signature;
      if (!isSignatureValid) {
        throw new Error('Invalid payment signature');
      }
    } catch (signatureError) {
      console.error('Signature verification failed:', signatureError);
      return res.status(400).json({ 
        status: 'failure', 
        message: 'Payment signature verification failed' 
      });
    }

    try {
      // Verify payment status with Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      console.log('Payment details:', payment);

      if (payment.status !== 'captured') {
        throw new Error(`Payment not captured. Status: ${payment.status}`);
      }

      // Verify payment amount matches
      if (amount && payment.amount !== amount * 100) {
        throw new Error('Payment amount mismatch');
      }
    } catch (paymentError) {
      console.error('Payment verification failed:', paymentError);
      return res.status(400).json({ 
        status: 'failure', 
        message: paymentError.message || 'Payment verification failed' 
      });
    }

    // Find and verify ad
    const ad = await Ad.findById(adId);
    if (!ad) {
      console.error('Ad not found:', adId);
      return res.status(404).json({ 
        status: 'failure', 
        message: 'Ad not found' 
      });
    }

    if (ad.sold) {
      console.error('Ad already sold:', adId);
      return res.status(400).json({ 
        status: 'failure', 
        message: 'This item has already been sold' 
      });
    }

    try {
      // Create order record
      const order = new Order({
        adId: ad._id,
        buyerId: buyerId,
        sellerId: ad.postedBy,
        title: ad.title,
        description: ad.description,
        price: ad.price,
        image: ad.image,
        category: ad.category || 'Uncategorized',  // Provide default if category is missing
        razorpay_order_id,
        razorpay_payment_id
      });

      try {
        await order.save();
        console.log('Order created:', order);
      } catch (saveError) {
        console.error('Error saving order:', saveError);
        throw new Error('Failed to save order: ' + saveError.message);
      }

      // Update ad as sold
      ad.sold = true;
      ad.soldTo = buyerId;
      await ad.save();
      console.log('Ad marked as sold');

      // Get buyer and seller details
      const [buyer, seller] = await Promise.all([
        User.findOne({ abcId: buyerId }),
        User.findOne({ abcId: ad.postedBy })
      ]);

      if (!buyer || !seller) {
        throw new Error('User not found');
      }

      // Send confirmation emails
      try {
        await sendOrderConfirmationEmail(
          buyer.email,
          seller.email,
          {
            title: ad.title,
            price: ad.price
          }
        );
        console.log('Confirmation emails sent');
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Continue despite email error
      }

      return res.json({ 
        status: 'success', 
        message: 'Payment verified and order processed successfully.',
        orderId: order._id
      });
    } catch (orderError) {
      console.error('Error processing order:', orderError);
      // If order creation fails, we should try to refund the payment
      try {
        await razorpay.payments.refund(razorpay_payment_id);
        console.log('Payment refunded due to order processing failure');
      } catch (refundError) {
        console.error('Refund failed:', refundError);
      }
      throw orderError;
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ 
      status: 'failure', 
      message: 'Error processing payment',
      error: error.message 
    });
  }
});

module.exports = router;