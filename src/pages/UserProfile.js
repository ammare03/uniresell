// src/pages/UserProfile.js
import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserProfile.css';

function UserProfile() {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [userAds, setUserAds] = useState([]);
  const [error, setError] = useState('');

  // Fetch full user details (including rating) from the backend
  useEffect(() => {
    if (user) {
      const fetchUserDetails = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${user.abcId}`);
          setUserDetails(res.data.user);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching user details.');
        }
      };

      const fetchUserAds = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/ads');
          const myAds = res.data.ads.filter(ad => ad.postedBy === user.abcId);
          setUserAds(myAds);
        } catch (err) {
          console.error('Error fetching user ads:', err);
        }
      };

      fetchUserDetails();
      fetchUserAds();
    }
  }, [user]);

  if (error) {
    return (
      <Container className="user-profile-page py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!userDetails) {
    return (
      <Container className="user-profile-page py-5">
        <p>Loading profile...</p>
      </Container>
    );
  }

  return (
    <div className="user-profile-page">
      <Container className="profile-content">
        {/* User Info Section */}
        <Row>
          <Col md={12}>
            <Card className="profile-card mb-4">
              <Card.Body className="text-center">
                <Card.Title>{userDetails.abcId}</Card.Title>
                <Card.Text className="email-text">Email: {userDetails.email}</Card.Text>
                <Card.Text>
                  Rating: {(userDetails.rating || 0).toFixed(1)} / 5 ({userDetails.ratingCount || 0} ratings)
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Ads Section */}
        <Row>
          <Col md={12}>
            <h2 className="section-title mb-4">Your Ads</h2>
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
      </Container>
    </div>
  );
}

export default UserProfile;