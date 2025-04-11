// src/pages/Cart.js
import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showError } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Calculate total price
  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  const handleRemove = (adId) => {
    removeFromCart(adId);
  };

  const handlePayment = async () => {
    if (!user) {
      showError('Please log in to make a purchase.');
      return;
    }
    
    if (cartItems.length === 0) {
      showError('Your cart is empty. Please add items before checkout.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        console.error('Razorpay not loaded');
        showError('Payment system is not ready. Please refresh the page and try again.');
        return;
      }
      
      console.log('Creating order with:', { 
        amount: totalAmount,
        adId: cartItems[0]._id,
        buyerId: user.abcId
      });
      
      // Use the correct endpoint with /api/payment prefix
      const res = await axios.post('http://localhost:5000/api/payment/create-order', { 
        amount: totalAmount,
        adId: cartItems[0]._id, // Assuming single item purchase for now
        buyerId: user.abcId // Get from AuthContext
      });
      
      console.log('Order creation response:', res.data);
      
      if (!res.data.order_id) {
        showError('Failed to create order. Missing order ID.');
        return;
      }
      
      const options = {
        key: 'rzp_test_l3iiBr281IE9vB', // Replace with your Razorpay key
        amount: res.data.amount,       // Total amount in rupees returned from backend
        currency: 'INR',
        order_id: res.data.order_id,   // Order ID from Razorpay
        name: 'UniResell',
        description: 'Purchase of items in cart',
        handler: async function (response) {
          try {
            console.log('Payment successful, verifying payment:', response);
            
            // Send payment verification to backend
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              adId: cartItems[0]._id,
              buyerId: user.abcId,
              amount: totalAmount
            });
            
            console.log('Verification response:', verifyRes.data);
            
            if (verifyRes.data.status === 'success') {
              // Clear cart on successful purchase
              clearCart();
              navigate('/order-confirmed', { 
                state: { 
                  adTitle: cartItems[0].title,
                  amount: totalAmount,
                  seller: cartItems[0].postedBy,
                  orderId: verifyRes.data.orderId
                }
              });
            } else {
              navigate('/unable-to-place-order');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            console.error('Error response:', error.response?.data);
            navigate('/unable-to-place-order');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            showError('Payment was cancelled.');
          }
        },
        prefill: {
          name: user.name || user.abcId,
          email: user.email,
          contact: '',
        },
        theme: {
          color: '#372948'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        showError(response.error.description || 'Payment failed');
      });
      
      razorpay.open();
    } catch (err) {
      console.error('Error initiating payment:', err);
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data
        });
        showError(err.response.data?.message || 'An error occurred while processing payment.');
      } else {
        showError('Unable to connect to payment service. Please try again.');
      }
      navigate('/unable-to-place-order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <Container className="cart-container">
        <h2 className="cart-header">Your Cart</h2>
        {cartItems.length === 0 ? (
          <Alert variant="info" className="text-center">
            Your cart is empty.
          </Alert>
        ) : (
          <>
            <ListGroup variant="flush" className="cart-items">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} className="cart-item">
                  <Row className="align-items-center">
                    <Col xs={3}>
                      <img src={item.image} alt={item.title} className="cart-item-image" />
                    </Col>
                    <Col xs={5} className="cart-item-details">
                      <h5>{item.title}</h5>
                      <p>₹{item.price}</p>
                    </Col>
                    <Col xs={4}>
                      <Button variant="outline-danger" onClick={() => handleRemove(item._id)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="order-summary">
              <h5>Total: ₹{totalAmount}</h5>
              <div className="order-summary-buttons">
                <Button variant="dark" onClick={clearCart} disabled={loading}>
                  Clear Cart
                </Button>
                <Button variant="success" onClick={handlePayment} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default Cart;