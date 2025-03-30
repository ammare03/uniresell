// src/pages/UnableToPlaceOrder.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/UnableToPlaceOrder.css';

function UnableToPlaceOrder() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true }); // Client-side redirect without page reload
  };

  return (
    <Container className="unable-to-place-order-page">
      <div className="unable-to-place-order-container">
        <h1>Unable to Place Order</h1>
        <p>Something went wrong with your payment. Please try again later.</p>
        <Button variant="danger" onClick={handleGoHome}>Go to Home</Button>
      </div>
    </Container>
  );
}

export default UnableToPlaceOrder;