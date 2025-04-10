// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Helper function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure nodemailer transporter using your environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { abcId, email, password } = req.body;
    if (!abcId || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    let user = await User.findOne({ abcId });
    if (user) {
      return res.status(400).json({ message: 'User with this ABC ID already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP (valid for 10 minutes)
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    // Create new user document (unverified)
    user = new User({
      abcId,
      email,
      password: hashedPassword,
      otp,
      otpExpiration,
      rating: 5, // Initial 5-star rating
      ratingCount: 0 // Initial rating count
    });

    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your OTP for UniResell Signup',
      text: `Your OTP is: ${otp}`
    });

    res.status(200).json({ message: 'Signup successful, OTP sent to email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// OTP Verification Route
router.post('/verify-otp', async (req, res) => {
  try {
    const { abcId, otp } = req.body;
    const user = await User.findOne({ abcId });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (user.otp !== otp || user.otpExpiration < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
    res.status(200).json({ message: 'OTP verified, account activated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { abcId, password } = req.body;
    if (!abcId || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await User.findOne({ abcId });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Account not verified.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    // Successful login response (token generation can be added here)
    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;