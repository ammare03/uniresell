// src/pages/UserDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button, Form, Alert, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserDetails.css';

function UserDetails() {
  const { abcId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [userAds, setUserAds] = useState({ active: [] });
  const [orderHistory, setOrderHistory] = useState([]);
  const [sellHistory, setSellHistory] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [hasRated, setHasRated] = useState(false);
  const isOwnProfile = currentUser && currentUser.abcId === abcId;

  // Fetch user details and their ads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Only add isOwner=true if the current user is viewing their own profile
        const isOwner = isOwnProfile ? '?isOwner=true' : '';
        const res = await axios.get(`http://localhost:5000/api/users/${abcId}${isOwner}`);
        setUserDetails(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user details.');
      }
    };

    const fetchUserAds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ads');
        const ads = res.data.ads.filter(ad => ad.postedBy === abcId && !ad.sold);
        setUserAds({ active: ads });
      } catch (err) {
        console.error('Error fetching user ads:', err);
      }
    };

    const fetchOrderHistory = async () => {
      if (isOwnProfile) {
        try {
          const res = await axios.get(`http://localhost:5000/api/orders/buyer/${abcId}`);
          setOrderHistory(res.data.orders);

          // Get detailed information for each seller
          if (res.data.orders.length > 0) {
            const enhancedOrders = await Promise.all(
              res.data.orders.map(async (order) => {
                try {
                  const sellerRes = await axios.get(`http://localhost:5000/api/users/${order.sellerId}`);
                  return {
                    ...order,
                    sellerFirstName: sellerRes.data.user.firstName || '',
                    sellerLastName: sellerRes.data.user.lastName || ''
                  };
                } catch (err) {
                  console.error(`Error fetching seller details: ${err}`);
                  return order;
                }
              })
            );
            setOrderHistory(enhancedOrders);
          }
        } catch (err) {
          console.error('Error fetching order history:', err);
        }
      }
    };

    const fetchSellHistory = async () => {
      if (!isOwnProfile) {
        try {
          const res = await axios.get(`http://localhost:5000/api/orders/seller/${abcId}`);
          
          // Get detailed information for each buyer
          if (res.data.orders.length > 0) {
            const enhancedOrders = await Promise.all(
              res.data.orders.map(async (order) => {
                try {
                  const buyerRes = await axios.get(`http://localhost:5000/api/users/${order.buyerId}`);
                  return {
                    ...order,
                    buyerFirstName: buyerRes.data.user.firstName || '',
                    buyerLastName: buyerRes.data.user.lastName || ''
                  };
                } catch (err) {
                  console.error(`Error fetching buyer details: ${err}`);
                  return order;
                }
              })
            );
            setSellHistory(enhancedOrders);
          } else {
            setSellHistory(res.data.orders);
          }
        } catch (err) {
          console.error('Error fetching sell history:', err);
        }
      }
    };

    // Check if the current user has already rated this seller
    const checkPreviousRating = async () => {
      if (currentUser && !isOwnProfile) {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${abcId}/has-rated?raterAbcId=${currentUser.abcId}`);
          setHasRated(res.data.hasRated);
          if (res.data.hasRated && res.data.existingRating) {
            setNewRating(res.data.existingRating.rating);
            setMessage('You have already rated this user.');
          }
        } catch (err) {
          console.error('Error checking previous rating:', err);
        }
      }
    };

    fetchUserDetails();
    fetchUserAds();
    fetchOrderHistory();
    fetchSellHistory();
    checkPreviousRating();
  }, [abcId, isOwnProfile, currentUser]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to rate users.');
      return;
    }
    
    if (hasRated) {
      setError('You have already rated this user.');
      return;
    }
    
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${abcId}/rating`, { 
        rating: newRating,
        raterAbcId: currentUser.abcId 
      });
      
      setUserDetails(res.data.user);
      setMessage(`Thank you! The new average rating is ${res.data.user.rating.toFixed(1)} / 5.`);
      setHasRated(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating rating.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="user-details-page">
        <div className="details-content">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="user-details-page">
        <div className="details-content text-center">
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-details-page">
      <div className="details-content">
        <Row>
          <Col md={12}>
            <Card className="profile-card mb-4">
              <Card.Body className="text-center">
                <Card.Title>
                  {`${userDetails.firstName || ''} ${userDetails.lastName || ''}`}
                </Card.Title>
                <Card.Text className="email-text">Email: {userDetails.email}</Card.Text>
                <Card.Text>
                  Credits: {userDetails.credits || 0}
                </Card.Text>
                <Card.Text>
                  Rating: {(userDetails.rating || 0).toFixed(1)} / 5 ({userDetails.totalRatings || 0} ratings)
                </Card.Text>
                {!isOwnProfile && currentUser && (
                  <div className="rating-section">
                    {hasRated ? (
                      <div className="rated-message">
                        <p>You've already rated this user.</p>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={24}
                              color={newRating >= star ? "#FFC107" : "#e4e5e9"}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Form onSubmit={handleRatingSubmit} className="rating-form">
                        <Form.Label>Rate this user:</Form.Label>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={24}
                              color={newRating >= star ? "#FFC107" : "#e4e5e9"}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setNewRating(star)}
                            />
                          ))}
                        </div>
                        <Button 
                          variant="primary" 
                          type="submit" 
                          className="mt-2"
                          disabled={newRating === 0}
                        >
                          Submit Rating
                        </Button>
                      </Form>
                    )}
                  </div>
                )}
                {message && <Alert variant="success" className="mt-3">{message}</Alert>}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Nav variant="tabs" className="profile-tabs mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'active'} 
              onClick={() => setActiveTab('active')}
            >
              Active Listings
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')}
            >
              {isOwnProfile ? 'Order History' : 'Sell History'}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === 'active' ? (
          <Row>
            <Col md={12}>
              <h2 className="section-title mb-4">Active Ads</h2>
              {userAds.active?.length === 0 ? (
                <Alert variant="info">No active ads available.</Alert>
              ) : (
                <Row>
                  {userAds.active?.map((ad) => (
                    <Col key={ad._id} xs={12} md={6} lg={4} className="mb-4">
                      <Card className="ad-card">
                        <Card.Img variant="top" src={ad.image} className="ad-image" />
                        <Card.Body>
                          <Card.Title>{ad.title}</Card.Title>
                          <Card.Text>{ad.description}</Card.Text>
                          <Card.Text><strong>₹{ad.price}</strong></Card.Text>
                          <Card.Text className="text-muted">
                            Posted on: {formatDate(ad.createdAt)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={12}>
              <h2 className="section-title mb-4">
                {isOwnProfile ? 'Order History' : 'Sell History'}
              </h2>
              {isOwnProfile ? (
                orderHistory.length === 0 ? (
                  <Alert variant="info">You haven't purchased any items yet.</Alert>
                ) : (
                  <Row>
                    {orderHistory.map((order) => (
                      <Col key={order._id} xs={12} md={6} lg={4} className="mb-4">
                        <Card className="history-card purchased">
                          <Card.Img variant="top" src={order.image} className="ad-image" />
                          <Card.Body>
                            <Card.Title>{order.title}</Card.Title>
                            <Card.Text>{order.description}</Card.Text>
                            <Card.Text><strong>₹{order.price}</strong></Card.Text>
                            <Card.Text className="text-muted">
                              Purchased from: {order.sellerFirstName} {order.sellerLastName}
                            </Card.Text>
                            <Card.Text className="text-muted">
                              Purchase date: {formatDate(order.purchaseDate)}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )
              ) : (
                sellHistory.length === 0 ? (
                  <Alert variant="info">No items sold yet.</Alert>
                ) : (
                  <Row>
                    {sellHistory.map((order) => (
                      <Col key={order._id} xs={12} md={6} lg={4} className="mb-4">
                        <Card className="history-card sold">
                          <div className="sold-overlay">SOLD</div>
                          <Card.Img variant="top" src={order.image} className="ad-image" />
                          <Card.Body>
                            <Card.Title>{order.title}</Card.Title>
                            <Card.Text>{order.description}</Card.Text>
                            <Card.Text><strong>₹{order.price}</strong></Card.Text>
                            <Card.Text className="text-muted">
                              Sold to: {order.buyerFirstName} {order.buyerLastName}
                            </Card.Text>
                            <Card.Text className="text-muted">
                              Sale date: {formatDate(order.purchaseDate)}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )
              )}
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default UserDetails;