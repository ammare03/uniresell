// src/pages/Signup.js
import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    abcId: '',
    name: '',
    email: '',
    password: '',
    isValidAbcId: false,
    abcIdError: ''
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Signup; Step 2: OTP verification
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const [validatingId, setValidatingId] = useState(false);
  const [idValidated, setIdValidated] = useState(false);
  const [idError, setIdError] = useState('');
  const { signup, verifyOtp, validateAbcId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [abcIdError, setAbcIdError] = useState('');

  // Function to validate ABC ID
  const validateId = async () => {
    if (!formData.abcId) return;
    
    try {
      setValidatingId(true);
      // Call the validateAbcId function from AuthContext
      const userData = await validateAbcId(formData.abcId);
      // Set the name from the database
      setFormData(prev => ({
        ...prev,
        name: userData.name,
        isValidAbcId: true
      }));
      setAbcIdError("");
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        isValidAbcId: false
      }));
      setAbcIdError(error);
    } finally {
      setValidatingId(false);
    }
  };
  
  // Effect to debounce the ABC ID validation
  useEffect(() => {
    const handler = setTimeout(() => {
      validateId();
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [formData.abcId]);
  
  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.isValidAbcId) {
      setAbcIdError("Please enter a valid ABC ID");
      return;
    }
    
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      const message = await signup({
        abcId: formData.abcId,
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      
      console.log('Signup successful:', message);
      
      // Set step to OTP verification
      setStep(2);
      setMessage("OTP has been sent to your email address. Please verify to complete registration.");
    } catch (err) {
      console.error('Error during signup:', err);
      setError(typeof err === 'string' ? err : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const msg = await verifyOtp({ abcId: formData.abcId, otp });
      setMessage(msg);
      // On successful OTP verification, redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (errMsg) {
      setError(errMsg);
    } finally {
      setLoading(false);
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
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>ABC ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="abcId"
                          value={formData.abcId}
                          onChange={handleChange}
                          placeholder="Enter your ABC ID"
                          isValid={formData.isValidAbcId}
                          isInvalid={abcIdError && formData.abcId.length > 0}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {abcIdError}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                          ABC ID verified successfully!
                        </Form.Control.Feedback>
                        {validatingId && (
                          <div className="mt-2 d-flex align-items-center">
                            <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                            <small>Validating ABC ID...</small>
                          </div>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          disabled={!formData.isValidAbcId}
                          required
                        />
                        <Form.Text className="text-muted">
                          Your name will be displayed on your profile and listings.
                        </Form.Text>
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
                      <Button 
                        variant="dark" 
                        type="submit" 
                        className="w-100"
                        disabled={!formData.isValidAbcId || validatingId || !formData.name || loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Signing up...
                          </>
                        ) : (
                          'Sign Up'
                        )}
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
                      <Button variant="dark" type="submit" className="w-100" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Verifying...
                          </>
                        ) : (
                          'Verify OTP'
                        )}
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