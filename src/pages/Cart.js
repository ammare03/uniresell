// src/pages/Cart.js
import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const handleRemove = (adId) => {
    removeFromCart(adId);
  };

  const handlePayment = async () => {
    const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);
    
    try {
      // Request to create an order with Razorpay
      const res = await axios.post('http://localhost:5000/api/create-order', { amount: totalAmount });

      // Dynamically load Razorpay script if it's not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: 'rzp_test_l3iiBr281IE9vB',  // Replace with your Razorpay key
            amount: res.data.amount,       // Total amount
            currency: 'INR',
            order_id: res.data.order_id,   // Order ID from Razorpay
            name: 'UniResell',
            description: 'Purchase of items in cart',
            handler: function (response) {
              window.location.href = '/order-confirmed';
            },
            prefill: {
              name: 'John Doe',
              email: 'johndoe@example.com',
              contact: '9123456789',
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };
        document.body.appendChild(script);
      } else {
        // Razorpay already loaded, directly use it
        const options = {
          key: 'rzp_test_l3iiBr281IE9vB',  // Replace with your Razorpay key
          amount: res.data.amount,
          currency: 'INR',
          order_id: res.data.order_id,
          name: 'UniResell',
          description: 'Purchase of items in cart',
          handler: function (response) {
            window.location.href = '/order-confirmed';
          },
          prefill: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            contact: '9123456789',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      window.location.href = '/unable-to-place-order';
    }
  };

  return (
    <div className="cart-page">
      <Container>
        <h2 className="text-center my-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <>
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col xs={3}>
                      <img src={item.image} alt={item.title} className="img-fluid" />
                    </Col>
                    <Col xs={5}>
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
            <div className="text-center mt-3">
              <Button variant="dark" onClick={clearCart}>Clear Cart</Button>
              <Button variant="success" className="mt-3" onClick={handlePayment}>
                Proceed to Payment
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default Cart;