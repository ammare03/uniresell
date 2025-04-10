const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Ad = require('../models/Ad');
const User = require('../models/User');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Your Razorpay API Secret
const razorpaySecret = 'bmJMT1Rup2X28bQkGQkv0rZ3';  // Replace with your Razorpay secret

// Verify Payment Signature
router.post('/verify-payment', async (req, res) => {
  console.log('Payment verification request received:', req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, adId, buyerId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !adId || !buyerId) {
    console.error('Missing required parameters:', { 
      razorpay_order_id, razorpay_payment_id, razorpay_signature, adId, buyerId 
    });
    return res.status(400).send({ status: 'failure', message: 'Missing required parameters' });
  }

  const hmac = crypto.createHmac('sha256', razorpaySecret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');
  
  console.log('Signature verification:', {
    provided: razorpay_signature,
    generated: generated_signature,
    match: generated_signature === razorpay_signature
  });

  if (generated_signature === razorpay_signature) {
    try {
      // Update ad status
      console.log('Looking for ad with ID:', adId);
      const ad = await Ad.findById(adId);
      if (!ad) {
        console.error('Ad not found with ID:', adId);
        return res.status(404).send({ status: 'failure', message: 'Ad not found' });
      }
      console.log('Ad found:', ad);

      ad.sold = true;
      ad.soldTo = buyerId;
      await ad.save();
      console.log('Ad updated as sold');

      // Get buyer and seller emails
      console.log('Looking for buyer with ID:', buyerId);
      const buyer = await User.findOne({ abcId: buyerId });
      console.log('Looking for seller with ID:', ad.postedBy);
      const seller = await User.findOne({ abcId: ad.postedBy });

      console.log('Buyer found:', buyer ? 'Yes' : 'No');
      console.log('Seller found:', seller ? 'Yes' : 'No');

      if (!buyer || !seller) {
        console.error('User not found. Buyer:', !!buyer, 'Seller:', !!seller);
        return res.status(404).send({ status: 'failure', message: 'User not found' });
      }

      // Send confirmation emails
      try {
        console.log('Sending emails to:', {
          buyer: buyer.email,
          seller: seller.email,
          adDetails: {
            title: ad.title,
            price: ad.price
          }
        });
        
        await sendOrderConfirmationEmail(
          buyer.email,
          seller.email,
          {
            title: ad.title,
            price: ad.price
          }
        );
        console.log('Emails sent successfully');
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Continue with the process even if email sending fails
      }

      console.log('Sending success response');
      res.send({ status: 'success', message: 'Payment verified and order processed successfully.' });
    } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).send({ status: 'failure', message: 'Error processing order', error: error.message });
    }
  } else {
    console.error('Payment verification failed - signature mismatch');
    res.status(400).send({ status: 'failure', message: 'Payment verification failed.' });
  }
});

module.exports = router;