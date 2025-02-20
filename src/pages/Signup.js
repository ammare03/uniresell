// src/pages/Signup.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar } from 'react-bootstrap';
import '../styles/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    abcId: '',
    email: '',
    password: ''
  });

  // For password strength
  const [strength, setStrength] = useState(0);

  // Evaluate password strength
  const evaluateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    setStrength(score);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      evaluateStrength(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic signup logic or API call
    alert(`Signing up with ABC ID: ${formData.abcId} and Email: ${formData.email}`);
  };

  // Map strength score (0 to 5) to a progress bar variant
  const getVariant = () => {
    switch (strength) {
      case 0: return 'danger';
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'primary';
      case 5: return 'success';
      default: return 'danger';
    }
  };

  // Convert strength to a percentage
  const getStrengthPercentage = () => (strength / 5) * 100;

  return (
    <div className="signup-page">
      <div className="wave-top"></div>
      <Container className="signup-container d-flex align-items-center justify-content-center">
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="signup-card">
              <Card.Body>
                <h2 className="text-center mb-4">Create an Account</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>ABC ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="abcId"
                      value={formData.abcId}
                      onChange={handleChange}
                      placeholder="Enter your ABC ID"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter a strong password"
                      required
                    />
                    <div className="mt-2">
                      <ProgressBar
                        now={getStrengthPercentage()}
                        variant={getVariant()}
                        label={
                          strength > 0
                            ? `${Math.round(getStrengthPercentage())}%`
                            : ''
                        }
                      />
                      <small className="text-muted">
                        Must be at least 8 characters, include upper &amp; lower case, digit, and special character.
                      </small>
                    </div>
                  </Form.Group>
                  <Button variant="dark" type="submit" className="w-100">
                    Sign Up
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="wave-bottom"></div>
    </div>
  );
}

export default Signup;