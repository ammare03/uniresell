const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Your Razorpay API Secret
const razorpaySecret = 'bmJMT1Rup2X28bQkGQkv0rZ3';  // Replace with your Razorpay secret

// Verify Payment Signature
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', razorpaySecret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment successful, process order here
    res.send({ status: 'success', message: 'Payment verified successfully.' });
  } else {
    res.status(400).send({ status: 'failure', message: 'Payment verification failed.' });
  }
});

module.exports = router;