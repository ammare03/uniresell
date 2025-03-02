// src/pages/Sell.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // import CartContext
import { useNavigate } from 'react-router-dom';
import '../styles/Sell.css';

function Sell() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext); // use addToCart from CartContext
  const navigate = useNavigate();
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    price: '',
    image: '' // base64 string
  });
  const [ads, setAds] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ads');
      setAds(res.data.ads);
    } catch (err) {
      console.error('Error fetching ads:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData({ ...adData, [name]: value });
    setError('');
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdData({ ...adData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError('You must be logged in to post an ad.');
      return;
    }
    try {
      const payload = { ...adData, postedBy: user.abcId };
      const res = await axios.post('http://localhost:5000/api/ads', payload);
      setMessage(res.data.message);
      setAds([res.data.ad, ...ads]);
      setAdData({ title: '', description: '', price: '', image: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to post ad.');
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
    <div className="sell">
      <Container>
        <h2 className="text-center mb-4">Sell Your Product</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={adData.title}
              onChange={handleChange}
              placeholder="Enter product title"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={adData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={adData.price}
              onChange={handleChange}
              placeholder="Enter product price"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100">
            Post Ad
          </Button>
        </Form>

        <h3 className="mt-5">Active Ads</h3>
        {ads.length === 0 && <p>No ads available.</p>}
        <Row>
          {ads.map((ad) => (
            <Col key={ad._id} xs={12} md={6} className="mb-4">
              <Card className="ad-card">
                <Card.Img variant="top" src={ad.image} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{ad.title}</Card.Title>
                  <Card.Text>{ad.description}</Card.Text>
                  <Card.Text><strong>${ad.price}</strong></Card.Text>
                  <Button variant="outline-dark" onClick={() => handleAddToCart(ad)} className="me-2">
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

export default Sell;