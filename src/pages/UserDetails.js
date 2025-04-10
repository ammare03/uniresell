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
  const isOwnProfile = currentUser && currentUser.abcId === abcId;

  // Fetch user details and their ads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${abcId}`);
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
        } catch (err) {
          console.error('Error fetching order history:', err);
        }
      }
    };

    const fetchSellHistory = async () => {
      if (!isOwnProfile) {
        try {
          const res = await axios.get(`http://localhost:5000/api/orders/seller/${abcId}`);
          setSellHistory(res.data.orders);
        } catch (err) {
          console.error('Error fetching sell history:', err);
        }
      }
    };

    fetchUserDetails();
    fetchUserAds();
    fetchOrderHistory();
    fetchSellHistory();
  }, [abcId, isOwnProfile]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/users/${abcId}/rate`, { newRating });
      setUserDetails(res.data.user);
      setMessage(`Thank you! The new average rating is ${res.data.user.rating.toFixed(1)} / 5.`);
      setNewRating(0);
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
                <Card.Title>{userDetails.abcId}</Card.Title>
                <Card.Text className="email-text">Email: {userDetails.email}</Card.Text>
                <Card.Text>
                  Rating: {(userDetails.rating || 0).toFixed(1)} / 5 ({userDetails.ratingCount || 0} ratings)
                </Card.Text>
                {!isOwnProfile && (
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
                    <Button variant="primary" type="submit" className="mt-2">
                      Submit Rating
                    </Button>
                  </Form>
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
                              Purchased from: {order.sellerId}
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
                              Sold to: {order.buyerId}
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