// src/pages/UnableToPlaceOrder.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../styles/UnableToPlaceOrder.css';

function UnableToPlaceOrder() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true }); // Client-side redirect without reload
  };

  return (
    <div className="unable-to-place-order-page">
      <div className="unable-to-place-order-container">
        <FaExclamationTriangle className="failure-icon" />
        <h1>Order Failed</h1>
        <p>Something went wrong with your payment. Please try again later.</p>
        <Button variant="danger" onClick={handleGoHome}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}

export default UnableToPlaceOrder;