// src/pages/ActiveAds.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import '../styles/ActiveAds.css';

function ActiveAds() {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAds, setFilteredAds] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Fetch all active ads from the backend
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ads');
        setAds(res.data.ads);
        setFilteredAds(res.data.ads);  // Initially, show all ads
      } catch (err) {
        console.error('Error fetching ads:', err);
      }
    };
    fetchAds();
  }, []);

  // Handle search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterAds(query);
  };

  const filterAds = (query) => {
    if (query === '') {
      setFilteredAds(ads); // Show all ads if search query is empty
    } else {
      const result = ads.filter((ad) =>
        ad.title.toLowerCase().includes(query.toLowerCase()) ||
        ad.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAds(result);
    }
  };

  const handleAddToCart = (ad) => {
    addToCart(ad);
    alert(`Ad "${ad.title}" added to cart!`);
  };

  const handleViewProduct = (adId) => {
    navigate(`/ad/${adId}`);
  };

  return (
    <div className="active-ads-page">
      <Container>
        <h2 className="text-center mb-4">Active Ads</h2>

        {/* Search Bar */}
        <Form className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search for ads..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form>

        {/* Ads List */}
        {filteredAds.length === 0 && <p>No ads found.</p>}
        <Row>
          {filteredAds.map((ad) => (
            <Col key={ad._id} xs={12} md={6} className="mb-4">
              <Card className="ad-card">
                <Card.Img variant="top" src={ad.image} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{ad.title}</Card.Title>
                  <Card.Text>{ad.description}</Card.Text>
                  <Card.Text><strong>₹{ad.price}</strong></Card.Text>
                  <Button variant="outline-dark" className="me-2" onClick={() => handleAddToCart(ad)}>
                    Add to Cart
                  </Button>
                  <Button variant="dark" onClick={() => handleViewProduct(ad._id)}>
                    View Product
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default ActiveAds;