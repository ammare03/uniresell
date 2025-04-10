// server/models/Ad.js
const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  postedBy: { type: String, required: true }, // e.g., the ABC ID of the user
  createdAt: { type: Date, default: Date.now },
  sold: { type: Boolean, default: false },
  soldTo: { type: String } // Store the buyer's ID when sold
});

module.exports = mongoose.model('Ad', AdSchema);