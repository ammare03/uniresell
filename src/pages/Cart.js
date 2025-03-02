// src/pages/Cart.js
import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const handleRemove = (adId) => {
    removeFromCart(adId);
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
                      <p>${item.price}</p>
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
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default Cart;