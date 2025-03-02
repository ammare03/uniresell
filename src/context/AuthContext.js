// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Login function: calls /api/login endpoint
  const login = async (credentials) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', credentials);
      if (res.data.message === 'Login successful.') {
        setIsLoggedIn(true);
        setUser({ abcId: credentials.abcId });
      }
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || 'Login failed.';
    }
  };

  // Signup function: calls /api/signup endpoint
  const signup = async (signupData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/signup', signupData);
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || 'Signup failed.';
    }
  };

  // OTP verification function: calls /api/verify-otp endpoint
  const verifyOtp = async (otpData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/verify-otp', otpData);
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || 'OTP verification failed.';
    }
  };

  // Logout function: simply clear state (for now)
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};