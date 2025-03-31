// src/pages/AdDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdDetail.css';

function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [ad, setAd] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch ad details
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

  // After ad is loaded, fetch seller details based on ad.postedBy
  useEffect(() => {
    if (ad && ad.postedBy) {
      const fetchSeller = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${ad.postedBy}`);
          setSellerDetails(res.data.user);
        } catch (err) {
          console.error('Error fetching seller details:', err);
        }
      };
      fetchSeller();
    }
  }, [ad]);

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
        key: 'rzp_test_l3iiBr281IE9vB', // Your Razorpay key (test key)
        amount: res.data.amount,
        currency: 'INR',
        order_id: res.data.order_id,
        name: 'UniResell',
        description: 'Purchase of a textbook/note',
        handler: function (response) {
          navigate('/order-confirmed', { replace: true });
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
      navigate('/unable-to-place-order', { replace: true });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewSellerProfile = () => {
    if (user && ad && user.abcId === ad.postedBy) {
      navigate('/profile');
    } else {
      navigate(`/user/${ad.postedBy}`);
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
        <Button variant="outline-light" onClick={handleBack} className="mb-4 back-btn">
          &larr; Back
        </Button>
        <Row>
          <Col md={6}>
            <Card className="ad-detail-card">
              <Card.Img variant="top" src={ad.image} className="ad-image" />
            </Card>
          </Col>
          <Col md={6}>
            <div className="ad-detail-content">
              <h2>{ad.title}</h2>
              <p>{ad.description}</p>
              <h4 className="price">₹{ad.price}</h4>
              <div className="seller-info">
                <p>
                  <strong>Seller:</strong> {ad.postedBy}
                </p>
                <p>
                  <strong>Rating:</strong> {sellerDetails && sellerDetails.rating != null ? sellerDetails.rating.toFixed(1) : 'N/A'} / 5
                </p>
                <Button variant="outline-secondary" onClick={handleViewSellerProfile} className="mt-2">
                  View Seller Profile
                </Button>
              </div>
              <div className="ad-detail-buttons">
                <Button variant="outline-light" onClick={handleAddToCart} className="me-2">
                  Add to Cart
                </Button>
                <Button variant="light" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdDetail;