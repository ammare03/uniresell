// src/pages/Sell.js
import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaTag, FaImage, FaEye, FaEyeSlash, FaUpload, FaDollarSign, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Sell.css';

const CATEGORIES = [
  'Textbooks',
  'Generated Notes',
  'Handwritten Notes',
  'Reference Books'
];

function Sell() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'New',
    tags: []
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Load draft if exists
  useEffect(() => {
    const draft = localStorage.getItem('adDraft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setAdData(parsedDraft);
      if (parsedDraft.image) {
        setPreviewImage(parsedDraft.image);
      }
      setIsDraft(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData({ ...adData, [name]: value });
    setError('');
    setMessage('');
    // Save to draft
    localStorage.setItem('adDraft', JSON.stringify({ ...adData, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setAdData({ ...adData, tags });
    localStorage.setItem('adDraft', JSON.stringify({ ...adData, tags }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setSelectedImage(file);
      // Save preview to draft
      localStorage.setItem('adDraft', JSON.stringify({ 
        ...adData, 
        image: reader.result 
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!adData.title.trim()) return 'Title is required';
    if (!adData.description.trim()) return 'Description is required';
    if (!adData.price || adData.price <= 0) return 'Valid price is required';
    if (!adData.category) return 'Category is required';
    if (!selectedImage && !previewImage) return 'Image is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError('You must be logged in to post an ad.');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Create the ad data object
      const adPayload = {
        title: adData.title.trim(),
        description: adData.description.trim(),
        price: Number(adData.price),
        category: adData.category,
        condition: adData.condition,
        postedBy: user.abcId,
        tags: adData.tags,
        image: previewImage // This is already a base64 string from the FileReader
      };

      // Debug logs
      console.log('Submitting ad with payload:', {
        title: adPayload.title,
        description: adPayload.description,
        price: adPayload.price,
        postedBy: adPayload.postedBy,
        hasImage: !!adPayload.image
      });

      const res = await axios.post('http://localhost:5000/api/ads', adPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response:', res.data);

      setMessage('Ad posted successfully!');
      // Clear form and draft
      setAdData({ 
        title: '', 
        description: '', 
        price: '', 
        category: '', 
        condition: 'New',
        tags: []
      });
      setSelectedImage(null);
      setPreviewImage(null);
      localStorage.removeItem('adDraft');
      setIsDraft(false);
      
      // Redirect to the ad page
      if (res.data.ad && res.data.ad._id) {
        navigate(`/ad/${res.data.ad._id}`);
      }
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to post ad.');
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('adDraft');
    setAdData({ 
      title: '', 
      description: '', 
      price: '', 
      category: '', 
      condition: 'New',
      tags: []
    });
    setSelectedImage(null);
    setPreviewImage(null);
    setIsDraft(false);
  };

  return (
    <div className="sell">
      <Container className="sell-container">
        <div className="sell-form-card">
          <h2 className="text-center mb-4">
            <FaUpload className="me-2" />
            Sell Your Product
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          {isDraft && (
            <Alert variant="info" className="draft-alert">
              <div className="d-flex justify-content-between align-items-center">
                <span>You have a saved draft</span>
                <Button variant="outline-danger" size="sm" onClick={clearDraft}>
                  Clear Draft
                </Button>
              </div>
            </Alert>
          )}
          
          <Row>
            <Col md={isPreview ? 6 : 12}>
              <Form onSubmit={handleSubmit} className="sell-form">
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label><FaTag className="me-2" /> Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={adData.title}
                    onChange={handleChange}
                    placeholder="Enter product title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCategory">
                  <Form.Label><FaInfoCircle className="me-2" /> Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={adData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label><FaInfoCircle className="me-2" /> Description</Form.Label>
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPrice">
                      <Form.Label><FaDollarSign className="me-2" /> Price (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={adData.price}
                        onChange={handleChange}
                        placeholder="Enter product price"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCondition">
                      <Form.Label><FaInfoCircle className="me-2" /> Condition</Form.Label>
                      <Form.Select
                        name="condition"
                        value={adData.condition}
                        onChange={handleChange}
                        required
                      >
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formTags">
                  <Form.Label><FaTag className="me-2" /> Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={adData.tags.join(', ')}
                    onChange={handleTagsChange}
                    placeholder="e.g., textbook, engineering, semester 3"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Label><FaImage className="me-2" /> Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ maxWidth: '200px', maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                </Form.Group>

                <div className="button-group">
                  <Button
                    variant="outline-primary"
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="me-2"
                  >
                    {isPreview ? <><FaEyeSlash className="me-2" /> Hide Preview</> : <><FaEye className="me-2" /> Show Preview</>}
                  </Button>
                  <Button variant="primary" type="submit">
                    <FaUpload className="me-2" /> Post Ad
                  </Button>
                </div>
              </Form>
            </Col>

            {isPreview && (
              <Col md={6}>
                <div className="preview-section">
                  <Card className="preview-card">
                    {previewImage && (
                      <Card.Img variant="top" src={previewImage} />
                    )}
                    <Card.Body>
                      <Card.Title>{adData.title || 'Product Title'}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {adData.category || 'Category'} • {adData.condition}
                      </Card.Subtitle>
                      <Card.Text>
                        {adData.description || 'Product description will appear here'}
                      </Card.Text>
                      <div className="price-tag">₹{adData.price || '0'}</div>
                      {adData.tags.length > 0 && (
                        <div className="tags-container">
                          {adData.tags.map((tag, idx) => (
                            <span key={idx} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Sell;