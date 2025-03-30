// src/pages/Sell.js
import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Sell.css';

function Sell() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    price: '',
    image: '' // base64 string
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      setAdData({ title: '', description: '', price: '', image: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to post ad.');
    }
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
            <Form.Label>Price (₹)</Form.Label>
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
      </Container>
    </div>
  );
}

export default Sell;