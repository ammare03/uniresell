// src/pages/OrderConfirmed.js
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag, FaReceipt } from 'react-icons/fa';
import '../styles/OrderConfirmed.css';

function OrderConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state || {};

  // If accessed directly without state, redirect to home
  useEffect(() => {
    if (!location.state) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleViewOrders = () => {
    navigate('/profile/orders', { replace: true });
  };

  // If redirecting, don't render the component
  if (!location.state) {
    return null;
  }

  return (
    <div className="order-confirmed-page">
      <div className="order-confirmed-container">
        <FaCheckCircle className="confirmation-icon" />
        <h1>Order Confirmed</h1>
        <p>Your payment was successful and your order has been placed! Thank you for shopping with us.</p>
        
        {orderDetails.orderId && (
          <div className="order-info">
            <div className="order-detail">
              <FaReceipt className="order-detail-icon" />
              <span>Order ID: <strong>{orderDetails.orderId}</strong></span>
            </div>
            
            {orderDetails.adTitle && (
              <div className="order-detail">
                <FaShoppingBag className="order-detail-icon" />
                <span>Product: <strong>{orderDetails.adTitle}</strong></span>
              </div>
            )}
            
            {orderDetails.amount && (
              <div className="order-detail">
                <span>Amount Paid: <strong>₹{orderDetails.amount}</strong></span>
              </div>
            )}
          </div>
        )}
        
        <div className="action-buttons">
          <Button variant="primary" onClick={handleViewOrders} className="me-3">
            <FaShoppingBag className="me-2" /> View Orders
          </Button>
          <Button variant="outline-primary" onClick={handleGoHome}>
            <FaHome className="me-2" /> Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmed;