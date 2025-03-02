// src/context/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add an item to the cart
  const addToCart = (ad) => {
    setCartItems((prevItems) => {
      // Optionally, check if the ad already exists and increase quantity
      return [...prevItems, ad];
    });
  };

  // Remove an item from the cart
  const removeFromCart = (adId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== adId));
  };

  // Clear the cart (if needed)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};