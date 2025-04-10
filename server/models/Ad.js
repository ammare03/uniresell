// server/models/Ad.js
const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  postedBy: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  sold: {
    type: Boolean,
    default: false
  },
  soldTo: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ad', adSchema);