import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowAlert(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <div className="contact-page">
      <Container>
        <section className="contact-header">
          <h1>Contact Us</h1>
          <p className="lead">
            Have questions or concerns? We're here to help. Reach out to us using the form below
            or through our other contact channels.
          </p>
        </section>

        <Row className="contact-content">
          <Col md={7}>
            <div className="contact-form-container">
              {showAlert && (
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                  Thank you for your message! We'll get back to you soon.
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Message subject"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Your message"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="submit-button">
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>

          <Col md={5}>
            <div className="contact-info">
              <h3>Other Ways to Reach Us</h3>
              
              <div className="contact-method">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h4>Email</h4>
                  <p>support@uniresell.com</p>
                </div>
              </div>

              <div className="contact-method">
                <FaPhone className="contact-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+91 123-456-7890</p>
                  <p className="text-muted">Monday to Friday, 9am to 6pm</p>
                </div>
              </div>

              <div className="contact-method">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h4>Office</h4>
                  <p>MPSTME, NMIMS University</p>
                  <p>Mumbai, Maharashtra</p>
                </div>
              </div>

              <div className="support-hours">
                <h4>Support Hours</h4>
                <ul>
                  <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                  <li>Saturday: 10:00 AM - 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact; 