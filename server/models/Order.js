const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  },
  buyerId: {
    type: String,  // ABC ID of the buyer
    required: true
  },
  sellerId: {
    type: String,  // ABC ID of the seller
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: String,
  category: {
    type: String,
    required: false  // Make category optional
  },
  razorpay_order_id: {
    type: String,
    required: true
  },
  razorpay_payment_id: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 