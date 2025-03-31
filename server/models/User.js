// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  abcId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiration: { type: Date },
  // New fields for rating system:
  rating: { type: Number, default: 0 }, // Average rating (0 to 5)
  ratingCount: { type: Number, default: 0 } // Number of ratings received
});

module.exports = mongoose.model('User', UserSchema);