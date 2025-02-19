import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData) => {
    setIsLoggedIn(true);
    // Implement real authentication logic here
  };

  const signup = (userData) => {
    setIsLoggedIn(true);
    // Implement real signup logic here
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};