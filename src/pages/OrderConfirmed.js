// src/pages/OrderConfirmed.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/OrderConfirmed.css';

function OrderConfirmed() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true }); // Navigate client-side without a reload
  };

  return (
    <Container className="order-confirmed-page">
      <div className="order-confirmed-container">
        <h1>Order Confirmed</h1>
        <p>Your payment was successful, and your order has been placed!</p>
        <Button variant="success" onClick={handleGoHome}>
          Go to Home
        </Button>
      </div>
    </Container>
  );
}

export default OrderConfirmed;