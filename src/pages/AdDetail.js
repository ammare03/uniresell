// src/pages/AdDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaShare, FaRegClock } from 'react-icons/fa';
import SimilarAds from '../components/SimilarAds';
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
  const [shareMessage, setShareMessage] = useState('');

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
    setShareMessage('');
    alert(`Ad "${ad.title}" added to cart!`);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBuyNow = async () => {
    if (!user) {
      setError('Please log in to make a purchase.');
      return;
    }

    try {
      setError(''); // Clear any previous errors
      
      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        console.error('Razorpay not loaded');
        setError('Payment system is not ready. Please refresh the page and try again.');
        return;
      }

      // Create order
      console.log('Creating order with:', {
        amount: ad.price,
        adId: ad._id,
        buyerId: user.abcId
      });

      const res = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: ad.price,
        adId: ad._id,
        buyerId: user.abcId
      });

      console.log('Order creation response:', res.data);

      if (!res.data.order_id) {
        setError('Failed to create order. Missing order ID.');
        return;
      }

      const options = {
        key: 'rzp_test_l3iiBr281IE9vB',
        amount: res.data.amount,
        currency: 'INR',
        name: 'UniResell',
        description: `Purchase of ${ad.title}`,
        order_id: res.data.order_id,
        handler: async function (response) {
          try {
            console.log('Payment successful, verifying payment:', response);
            
            // Send payment verification to backend
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              adId: ad._id,
              buyerId: user.abcId,
              amount: ad.price
            });

            console.log('Verification response:', verifyRes.data);

            if (verifyRes.data.status === 'success') {
              navigate('/order-confirmed', { 
                state: { 
                  adTitle: ad.title,
                  amount: ad.price,
                  seller: ad.postedBy,
                  orderId: verifyRes.data.orderId
                }
              });
            } else {
              setError(verifyRes.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            console.error('Error response:', error.response?.data);
            setError(error.response?.data?.message || error.message || 'Error verifying payment');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setError('Payment cancelled by user');
          }
        },
        prefill: {
          name: user.abcId,
          email: user.email,
          contact: ''
        },
        theme: {
          color: '#372948'
        }
      };

      console.log('Creating Razorpay instance with options:', {
        amount: options.amount,
        currency: options.currency,
        order_id: options.order_id
      });

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(response.error.description || 'Payment failed');
      });

      razorpay.open();
    } catch (err) {
      console.error('Error initiating payment:', err);
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data
        });
      }
      setError(err.response?.data?.message || err.message || 'Error initiating payment');
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

        {shareMessage && (
          <Alert variant="success" className="share-alert">
            {shareMessage}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Card className="ad-detail-card">
              <Card.Img variant="top" src={ad.image} className="ad-image" />
              <Button 
                variant="light" 
                className="share-button" 
                onClick={handleShare}
                title="Share this ad"
              >
                <FaShare />
              </Button>
            </Card>
          </Col>
          <Col md={6}>
            <div className="ad-detail-content">
              <div className="d-flex justify-content-between align-items-start">
                <h2>{ad.title}</h2>
                <Badge bg="secondary" className="category-badge">
                  {ad.category}
                </Badge>
              </div>
              
              <div className="posted-date">
                <FaRegClock className="me-2" />
                Posted on {formatDate(ad.createdAt)}
              </div>

              <div className="description-section">
                <h5>Description</h5>
                <p>{ad.description}</p>
              </div>

              <h4 className="price">₹{ad.price}</h4>

              <Card className="seller-card">
                <Card.Body>
                  <h5>Seller Information</h5>
                  <div className="seller-info">
                    <p>
                      <strong>Seller:</strong> {sellerDetails && 
                        `${sellerDetails.firstName || ''} ${sellerDetails.lastName || ''}`}
                    </p>
                    <p>
                      <strong>Rating:</strong> {sellerDetails && sellerDetails.rating != null ? (
                        <span className="rating">
                          {sellerDetails.rating.toFixed(1)} / 5
                          <small className="text-muted ms-2">
                            ({sellerDetails.totalRatings} ratings)
                          </small>
                        </span>
                      ) : 'N/A'}
                    </p>
                    <Button 
                      variant="outline-light" 
                      onClick={handleViewSellerProfile} 
                      className="mt-2"
                    >
                      View Seller Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <div className="ad-detail-buttons">
                {user && ad.postedBy === user.abcId ? (
                  <Alert variant="info" className="mb-2">This is your ad</Alert>
                ) : (
                  <>
                    <Button variant="outline-light" onClick={handleAddToCart} className="me-2">
                      Add to Cart
                    </Button>
                    <Button variant="light" onClick={handleBuyNow}>
                      Buy Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Similar Ads Section */}
        <SimilarAds currentAdId={id} category={ad.category} />
      </Container>
    </div>
  );
}

export default AdDetail;