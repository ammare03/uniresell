// src/pages/Login.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({ abcId: '', password: '' });
  const [tip, setTip] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingId, setValidatingId] = useState(false);
  const [idValidated, setIdValidated] = useState(false);
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, validateAbcId, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const tips = [
    "Tip: A well-organized study routine is half the battle won.",
    "Tip: Try flashcards to remember tough concepts!",
    "Tip: Collaboration with peers often yields better results.",
    "Tip: Sell your old notes to help others and earn a bit of cash.",
    "Tip: Keep track of deadlines and plan ahead for a stress-free semester."
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  // For ABC ID validation with debounce
  useEffect(() => {
    // Don't validate if already redirecting (user is logged in)
    if (isLoggedIn) return;
    
    const validateId = async () => {
      // Clear any previous errors first
      setIdError('');

      // Basic format validation
      if (formData.abcId.length > 0 && !/^\d+$/.test(formData.abcId)) {
        setIdValidated(false);
        setIdError('ABC ID must contain only digits');
        return;
      }
      
      if (formData.abcId.length > 0 && formData.abcId.length !== 12) {
        setIdValidated(false);
        setIdError('ABC ID must be exactly 12 digits');
        return;
      }
      
      if (formData.abcId.length === 12) {
        setValidatingId(true);
        try {
          await validateAbcId(formData.abcId);
          setIdValidated(true);
          setIdError('');
        } catch (err) {
          setIdValidated(false);
          setIdError(err);
        } finally {
          setValidatingId(false);
        }
      } else {
        setIdValidated(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (formData.abcId) {
        validateId();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.abcId, validateAbcId, isLoggedIn]);

  // Validate password format and length
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    } else if (password.length > 50) {
      setPasswordError('Password cannot exceed 50 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear previous errors when user is typing
    setError('');
    
    if (name === 'password') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate ABC ID
    if (!formData.abcId) {
      setIdError('ABC ID is required');
      return;
    }
    
    if (!idValidated) {
      setIdError('Please enter a valid ABC ID');
      return;
    }
    
    // Validate password
    if (!validatePassword(formData.password)) {
      return;
    }
    
    setLoading(true);
    try {
      await login(formData);
      navigate('/'); // Redirect to homepage on successful login
    } catch (err) {
      setError(err);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, don't render the form at all (to prevent flash before redirect)
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="login-page">
      <div className="wave-top"></div>
      <Container className="login-container d-flex align-items-center justify-content-center">
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="login-card">
              <Card.Body>
                <h2 className="text-center mb-4">Welcome Back</h2>
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
                      isValid={idValidated}
                      isInvalid={idError && formData.abcId.length > 0}
                      required
                      maxLength={12}
                      pattern="\d{12}"
                      title="ABC ID must be a 12-digit number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {idError}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ABC ID verified!
                    </Form.Control.Feedback>
                    {validatingId && (
                      <div className="mt-2 d-flex align-items-center">
                        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                        <small>Validating ABC ID...</small>
                      </div>
                    )}
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
                      isInvalid={passwordError}
                      minLength={8}
                      maxLength={50}
                    />
                    <Form.Control.Feedback type="invalid">
                      {passwordError}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button 
                    variant="dark" 
                    type="submit" 
                    className="w-100 mb-3"
                    disabled={loading || validatingId}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                  <div className="text-center mb-3">
                    <p>
                      Don't have an account? <a href="/signup">Sign Up</a>
                    </p>
                  </div>
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