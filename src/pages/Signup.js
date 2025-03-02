// src/pages/Signup.js
import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    abcId: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Signup; Step 2: OTP verification
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const { signup, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

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
    setError('');
    if (name === 'password') {
      evaluateStrength(value);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const msg = await signup(formData);
      setMessage(msg);
      setStep(2);
    } catch (errMsg) {
      setError(errMsg);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const msg = await verifyOtp({ abcId: formData.abcId, otp });
      setMessage(msg);
      // On successful OTP verification, redirect to login page
      navigate('/login');
    } catch (errMsg) {
      setError(errMsg);
    }
  };

  const getVariant = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'danger';
      case 2:
        return 'warning';
      case 3:
        return 'info';
      case 4:
        return 'primary';
      case 5:
        return 'success';
      default:
        return 'danger';
    }
  };

  const getStrengthPercentage = () => (strength / 5) * 100;

  return (
    <div className="signup-page">
      <div className="wave-top"></div>
      <Container className="signup-container d-flex align-items-center justify-content-center">
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="signup-card">
              <Card.Body>
                {step === 1 && (
                  <>
                    <h2 className="text-center mb-4">Create an Account</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSignup}>
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
                            label={strength > 0 ? `${Math.round(getStrengthPercentage())}%` : ''}
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
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2 className="text-center mb-4">OTP Verification</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="info">{message}</Alert>}
                    <Form onSubmit={handleVerifyOtp}>
                      <Form.Group className="mb-4">
                        <Form.Label>Enter OTP</Form.Label>
                        <Form.Control
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter the OTP sent to your email"
                          required
                        />
                      </Form.Group>
                      <Button variant="dark" type="submit" className="w-100">
                        Verify OTP
                      </Button>
                    </Form>
                  </>
                )}
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