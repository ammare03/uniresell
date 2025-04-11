// src/pages/UnableToPlaceOrder.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaShoppingCart, FaHeadset } from 'react-icons/fa';
import '../styles/UnableToPlaceOrder.css';

function UnableToPlaceOrder() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true }); // Client-side redirect without reload
  };

  const handleGoToCart = () => {
    navigate('/cart', { replace: true });
  };

  const handleGoToContact = () => {
    navigate('/contact', { replace: true });
  };

  return (
    <div className="unable-to-place-order-page">
      <div className="unable-to-place-order-container">
        <FaExclamationTriangle className="failure-icon" />
        <h1>Order Failed</h1>
        <p>We encountered an issue while processing your payment. This could be due to network issues, insufficient funds, or a temporary problem with our payment system.</p>
        
        <div className="error-suggestions">
          <p>You can try the following:</p>
          <ul>
            <li>Check your internet connection</li>
            <li>Verify your payment method has sufficient funds</li>
            <li>Try a different payment method</li>
            <li>Contact customer support if the issue persists</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <Button variant="danger" onClick={handleGoToCart} className="me-3">
            <FaShoppingCart className="me-2" /> Return to Cart
          </Button>
          <Button variant="outline-primary" onClick={handleGoHome} className="me-3">
            <FaHome className="me-2" /> Go to Home
          </Button>
          <Button variant="outline-secondary" onClick={handleGoToContact}>
            <FaHeadset className="me-2" /> Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UnableToPlaceOrder;