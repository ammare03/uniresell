// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
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

  // Function to validate if an ABC ID exists in the database
  const validateAbcId = async (abcId) => {
    try {
      // Fetch the ABC ID database from the public folder
      // We need to use a relative path for this since it's in the public folder
      const response = await axios.get('/abcIdDatabase.json', {
        baseURL: window.location.origin // Use the frontend origin for public folder
      });
      
      if (response.data && Array.isArray(response.data)) {
        // Find the entry for this ABC ID
        const user = response.data.find(entry => entry["ABC ID"] === abcId);
        
        if (!user) {
          throw new Error('ABC ID does not exist!');
        }
        
        // Return user information that we can use to populate the form
        const userData = {
          name: `${user["First Name"]} ${user["Last Name"]}`,
          abcId: user["ABC ID"],
          // Add any other relevant fields here
        };
        
        return userData;
      } else {
        throw new Error('Unable to validate ABC ID. Database format error.');
      }
    } catch (error) {
      if (error.message === 'ABC ID does not exist!') {
        throw error.message;
      }
      throw 'Error validating ABC ID. Please try again.';
    }
  };

  const login = async (credentials) => {
    try {
      // First validate the ABC ID before proceeding with login
      await validateAbcId(credentials.abcId);
      
      // If validation passes, proceed with the login
      const res = await axios.post('/api/auth/login', credentials);
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
      if (typeof err === 'string') {
        throw err; // This is from our validation
      }
      throw err.response?.data?.message || 'Login failed.';
    }
  };

  const signup = async (signupData) => {
    try {
      // First validate the ABC ID before proceeding with signup
      await validateAbcId(signupData.abcId);
      
      // Ensure all required fields are present
      if (!signupData.abcId || !signupData.email || !signupData.password || !signupData.name) {
        throw 'All fields are required';
      }
      
      console.log('Signup data being sent:', {
        abcId: signupData.abcId,
        email: signupData.email,
        name: signupData.name,
        // omitting password for security
      });
      
      // If validation passes, proceed with the signup
      const res = await axios.post('/api/auth/signup', signupData);
      console.log('Signup response:', res.data);
      return res.data.message;
    } catch (err) {
      console.error('Signup error:', err);
      if (typeof err === 'string') {
        throw err; // This is from our validation
      }
      if (err.response) {
        console.error('Error response data:', err.response.data);
        throw err.response.data?.message || 'Signup failed. Server returned an error.';
      }
      throw 'Signup failed. Could not connect to the server.';
    }
  };

  const verifyOtp = async (otpData) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', otpData);
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
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, verifyOtp, logout, validateAbcId }}>
      {children}
    </AuthContext.Provider>
  );
};