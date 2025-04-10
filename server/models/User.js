// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  abcId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiration: { type: Date },
  rating: {
    type: Number,
    default: 5,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);