// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (credentials) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', credentials);
      if (res.data.message === 'Login successful.') {
        const userData = { abcId: credentials.abcId };
        setIsLoggedIn(true);
        setUser(userData);
        // Persist state in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || 'Login failed.';
    }
  };

  const signup = async (signupData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/signup', signupData);
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || 'Signup failed.';
    }
  };

  const verifyOtp = async (otpData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/verify-otp', otpData);
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || 'OTP verification failed.';
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};