// src/pages/UserProfile.js
import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserProfile.css';

function UserProfile() {
  const { user } = useContext(AuthContext);
  const [userAds, setUserAds] = useState([]);
  const [error, setError] = useState('');

  // Fetch ads posted by the current user
  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ads');
        const myAds = res.data.ads.filter(ad => ad.postedBy === user.abcId);
        setUserAds(myAds);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching your ads.');
      }
    };

    if (user) {
      fetchUserAds();
    }
  }, [user]);

  return (
    <div className="user-profile-page">
      <div className="profile-content">
        
        {/* User Info Card on Top */}
        <Row>
          <Col md={12}>
            <Card className="profile-card mb-4">
              <Card.Body className="text-center">
                <Card.Title>{user.abcId}</Card.Title>
                <Card.Text className="email-text">Email: {user.email}</Card.Text>
                <Card.Text>
                  Rating: {(user.rating || 0).toFixed(1)} / 5 ({user.ratingCount || 0} ratings)
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Ads Section */}
        <Row>
          <Col md={12}>
            <h2 className="section-title mb-4">Your Ads</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {userAds.length === 0 ? (
              <p>You haven't posted any ads yet.</p>
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

export default UserProfile;