// src/pages/AdDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import '../styles/AdDetail.css';

function AdDetail() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/ads/${id}`);
        setAd(res.data.ad);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching ad details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(ad);
    alert(`Ad "${ad.title}" added to cart!`);
  };

  const handleBuyNow = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/create-order', {
        amount: ad.price,
        adId: ad._id,
      });

      const options = {
        key: 'bmJMT1Rup2X28bQkGQkv0rZ3',
        amount: res.data.amount,
        currency: 'INR',
        order_id: res.data.order_id,
        name: 'UniResell',
        description: 'Purchase of a textbook/note',
        handler: function (response) {
          alert('Payment Successful');
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
    } catch (err) {
      alert('Payment Failed');
      window.location.href = '/unable-to-place-order';
    }
  };

  if (loading) {
    return (
      <Container className="ad-detail-container text-center">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="ad-detail-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="ad-detail-page">
      <Container className="py-5">
        <Row>
          <Col md={6}>
            <Card>
              <Card.Img 
                variant="top" 
                src={ad.image} 
                style={{ height: '400px', objectFit: 'cover', borderRadius: '8px' }} 
              />
            </Card>
          </Col>
          <Col md={6}>
            <h2>{ad.title}</h2>
            <p>{ad.description}</p>
            <h4 className="mt-3">₹{ad.price}</h4>
            <div className="mt-4">
              <Button variant="outline-dark" onClick={handleAddToCart} className="me-2">
                Add to Cart
              </Button>
              <Button variant="dark" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdDetail;