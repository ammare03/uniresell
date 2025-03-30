// src/pages/OrderConfirmed.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/OrderConfirmed.css';

function OrderConfirmed() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="order-confirmed-page">
      <div className="order-confirmed-container">
        <FaCheckCircle className="confirmation-icon" />
        <h1>Order Confirmed</h1>
        <p>Your payment was successful and your order has been placed! Thank you for shopping with us.</p>
        <Button variant="success" onClick={handleGoHome}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}

export default OrderConfirmed;