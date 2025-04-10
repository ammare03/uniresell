import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="footer-content">
          <Col md={4} className="footer-section">
            <h5>About UniResell</h5>
            <p>
              UniResell is your trusted marketplace for buying and selling items within
              your university community. Connect with fellow students and make the most
              of your campus experience.
            </p>
          </Col>
          
          <Col md={2} className="footer-section">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/active-ads">Browse Ads</Link></li>
              <li><Link to="/sell">Sell Items</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </Col>

          <Col md={3} className="footer-section">
            <h5>Help & Support</h5>
            <ul className="footer-links">
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </Col>

          <Col md={3} className="footer-section">
            <h5>Connect With Us</h5>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
            <div className="contact-info">
              <p>Email: support@uniresell.com</p>
              <p>Phone: +91 123-456-7890</p>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p>&copy; {currentYear} UniResell. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;