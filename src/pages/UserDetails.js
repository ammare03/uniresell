// src/pages/UserDetails.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import '../styles/UserDetails.css';

function UserDetails() {
  const { abcId } = useParams(); // route: /user/:abcId
  const [userDetails, setUserDetails] = useState(null);
  const [userAds, setUserAds] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        const ads = res.data.ads.filter(ad => ad.postedBy === abcId);
        setUserAds(ads);
      } catch (err) {
        console.error('Error fetching user ads:', err);
      }
    };

    fetchUserDetails();
    fetchUserAds();
  }, [abcId]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the new backend endpoint to update rating for the user
      const res = await axios.post(`http://localhost:5000/api/users/${abcId}/rate`, { newRating });
      setUserDetails(res.data.user);
      setMessage(`Thank you! The new average rating is ${res.data.user.rating.toFixed(1)} / 5.`);
      setNewRating(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating rating.');
    }
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
                {message && <Alert variant="success" className="mt-3">{message}</Alert>}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h2 className="section-title mb-4">Ads by {userDetails.abcId}</h2>
            {userAds.length === 0 ? (
              <p>This user hasn't posted any ads yet.</p>
            ) : (
              <Row>
                {userAds.map((ad) => (
                  <Col key={ad._id} xs={12} md={6} className="mb-4">
                    <Card className="ad-card">
                      <Card.Img variant="top" src={ad.image} className="ad-image" />
                      <Card.Body>
                        <Card.Title>{ad.title}</Card.Title>
                        <Card.Text>{ad.description}</Card.Text>
                        <Card.Text><strong>₹{ad.price}</strong></Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default UserDetails;