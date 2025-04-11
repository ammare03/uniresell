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
  const { login, validateAbcId } = useContext(AuthContext);
  const navigate = useNavigate();

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
    const validateId = async () => {
      if (formData.abcId.length >= 12) {
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
      } else if (formData.abcId.length > 0) {
        setIdValidated(false);
        setIdError('ABC ID must be at least 12 characters');
      } else {
        setIdValidated(false);
        setIdError('');
      }
    };

    const timeoutId = setTimeout(() => {
      if (formData.abcId) {
        validateId();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.abcId, validateAbcId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate ABC ID before submission
    if (!idValidated) {
      setError('Please enter a valid ABC ID');
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
                      placeholder="Enter your ABC ID"
                      isValid={idValidated}
                      isInvalid={idError && formData.abcId.length > 0}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {idError}
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
                    />
                  </Form.Group>
                  <Button 
                    variant="dark" 
                    type="submit" 
                    className="w-100"
                    disabled={loading || validatingId || !idValidated}
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