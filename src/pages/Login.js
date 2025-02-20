// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({ abcId: '', password: '' });
  const [tip, setTip] = useState('');

  // Simple array of tips
  const tips = [
    "Tip: A well-organized study routine is half the battle won.",
    "Tip: Try flashcards to remember tough concepts!",
    "Tip: Collaboration with peers often yields better results.",
    "Tip: Sell your old notes to help others and earn a bit of cash.",
    "Tip: Keep track of deadlines and plan ahead for a stress-free semester."
  ];

  // Pick a random tip on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic login logic or API call
    alert(`Logging in with ABC ID: ${formData.abcId}`);
  };

  return (
    <div className="login-page">
      <div className="wave-top"></div>
      <Container className="login-container d-flex align-items-center justify-content-center">
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="login-card">
              <Card.Body>
                <h2 className="text-center mb-4">Welcome Back</h2>
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
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>
                  <Button variant="dark" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>
                <div className="tip-of-the-day mt-4">
                  <strong>Tip of the Day:</strong> {tip}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="wave-bottom"></div>
    </div>
  );
}

export default Login;