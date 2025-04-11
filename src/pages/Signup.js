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
    confirmPassword: '',
    isValidAbcId: false
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Signup; Step 2: OTP verification
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const [validatingId, setValidatingId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abcIdError, setAbcIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const { signup, verifyOtp, validateAbcId, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Function to validate ABC ID
  const validateId = async () => {
    // Don't validate if already redirecting (user is logged in)
    if (isLoggedIn) return;
    
    if (!formData.abcId) return;
    
    // Check ABC ID format before making API call
    if (!/^\d{12}$/.test(formData.abcId)) {
      setAbcIdError('ABC ID must be exactly 12 digits');
      setFormData(prev => ({
        ...prev,
        isValidAbcId: false
      }));
      return;
    }
    
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
      setAbcIdError('');
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
    // Don't run validation if already logged in
    if (isLoggedIn) return;
    
    const handler = setTimeout(() => {
      validateId();
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [formData.abcId, isLoggedIn]);
  
  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else if (email.length > 100) {
      setEmailError('Email cannot exceed 100 characters');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  // Name validation function
  const validateName = (name) => {
    if (!name) {
      setNameError('Name is required');
      return false;
    } else if (name.length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    } else if (name.length > 50) {
      setNameError('Name cannot exceed 50 characters');
      return false;
    }
    setNameError('');
    return true;
  };
  
  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate ABC ID
    if (!formData.isValidAbcId) {
      setAbcIdError("Please enter a valid ABC ID");
      return;
    }
    
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    // Validate name
    if (!validateName(formData.name)) {
      return;
    }
    
    // Validate email
    if (!validateEmail(formData.email)) {
      return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Validate password length
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (formData.password.length > 50) {
      setPasswordError("Password cannot exceed 50 characters");
      return;
    }
    
    // Validate password strength
    if (strength < 3) {
      setPasswordError("Please use a stronger password with uppercase, lowercase, numbers, and special characters");
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
    
    // Provide specific feedback on password requirements
    if (password && score < 3) {
      let missingReqs = [];
      if (password.length < 8) missingReqs.push("at least 8 characters");
      if (!/[a-z]/.test(password)) missingReqs.push("lowercase letters");
      if (!/[A-Z]/.test(password)) missingReqs.push("uppercase letters");
      if (!/\d/.test(password)) missingReqs.push("numbers");
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) missingReqs.push("special characters");
      
      if (missingReqs.length) {
        setPasswordError(`Password needs: ${missingReqs.join(", ")}`);
      }
    } else {
      setPasswordError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear relevant errors
    if (name === 'abcId') setAbcIdError('');
    if (name === 'password' || name === 'confirmPassword') setPasswordError('');
    if (name === 'email') setEmailError('');
    if (name === 'name') setNameError('');
    setError('');
    
    // Evaluate password strength
    if (name === 'password') {
      evaluateStrength(value);
    }
    
    // Check if passwords match when changing confirmPassword
    if (name === 'confirmPassword' && value !== formData.password) {
      setPasswordError("Passwords do not match");
    } else if (name === 'confirmPassword') {
      setPasswordError('');
    }
    
    // Validate name on the fly
    if (name === 'name' && value) {
      validateName(value);
    }
    
    // Validate email on the fly if it has substantial content
    if (name === 'email' && value && value.includes('@')) {
      validateEmail(value);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be a 6-digit number");
      return;
    }
    
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

  // If already logged in, don't render the form at all (to prevent flash before redirect)
  if (isLoggedIn) {
    return null;
  }

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
                          placeholder="Enter your 12-digit ABC ID"
                          isValid={formData.isValidAbcId}
                          isInvalid={abcIdError && formData.abcId.length > 0}
                          required
                          maxLength={12}
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
                          isInvalid={nameError}
                          minLength={3}
                          maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">
                          {nameError}
                        </Form.Control.Feedback>
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
                          isInvalid={emailError}
                          maxLength={100}
                        />
                        <Form.Control.Feedback type="invalid">
                          {emailError}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter a strong password"
                          isInvalid={passwordError && formData.password.length > 0}
                          required
                          minLength={8}
                          maxLength={50}
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
                        <Form.Control.Feedback type="invalid">
                          {passwordError}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          isInvalid={passwordError && passwordError.includes("match")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {passwordError}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Button 
                        variant="dark" 
                        type="submit" 
                        className="w-100 mb-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Signing Up...
                          </>
                        ) : (
                          'Sign Up'
                        )}
                      </Button>
                      
                      <div className="text-center">
                        <p>
                          Already have an account? <a href="/login">Login</a>
                        </p>
                      </div>
                    </Form>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <h2 className="text-center mb-4">Verify Your Email</h2>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleVerifyOtp}>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter OTP sent to your email</Form.Label>
                        <Form.Control
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          required
                          maxLength={6}
                          pattern="\d{6}"
                          title="OTP must be a 6-digit number"
                        />
                        <Form.Text className="text-muted">
                          The OTP is valid for 10 minutes.
                        </Form.Text>
                      </Form.Group>
                      <Button 
                        variant="dark" 
                        type="submit" 
                        className="w-100 mb-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Verifying...
                          </>
                        ) : (
                          'Verify OTP'
                        )}
                      </Button>
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          className="p-0"
                          onClick={() => setStep(1)}
                        >
                          Back to Sign Up
                        </Button>
                      </div>
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