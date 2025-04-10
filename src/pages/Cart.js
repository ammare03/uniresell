// src/pages/Cart.js
import React, { useContext } from 'react';
import { Container, Row, Col, Button, ListGroup, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Calculate total price
  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  const handleRemove = (adId) => {
    removeFromCart(adId);
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/create-order', { 
        amount: totalAmount,
        adId: cartItems[0]._id, // Assuming single item purchase for now
        buyerId: user.abcId // Get from AuthContext
      });
      const options = {
        key: 'rzp_test_l3iiBr281IE9vB', // Replace with your Razorpay key
        amount: res.data.amount,       // Total amount in rupees returned from backend
        currency: 'INR',
        order_id: res.data.order_id,   // Order ID from Razorpay
        name: 'UniResell',
        description: 'Purchase of items in cart',
        handler: function (response) {
          // Send payment verification to backend
          axios.post('http://localhost:5000/api/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            adId: cartItems[0]._id,
            buyerId: user.abcId
          }).then((res) => {
            if (res.data.status === 'success') {
              window.location.href = '/order-confirmed';
            } else {
              window.location.href = '/unable-to-place-order';
            }
          }).catch((error) => {
            console.error('Payment verification error:', error);
            window.location.href = '/unable-to-place-order';
          });
        },
        prefill: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          contact: '9123456789',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      window.location.href = '/unable-to-place-order';
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
                <Button variant="dark" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button variant="success" onClick={handlePayment}>
                  Proceed to Payment
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