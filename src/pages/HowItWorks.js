import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserPlus, FaUpload, FaHandshake, FaShoppingCart } from 'react-icons/fa';
import '../styles/HowItWorks.css';

function HowItWorks() {
  const steps = [
    {
      icon: <FaUserPlus />,
      title: "Sign Up",
      description: "Create your account using your university email to join the UniResell community."
    },
    {
      icon: <FaUpload />,
      title: "List Your Items",
      description: "Take photos and list your items for sale with detailed descriptions and fair prices."
    },
    {
      icon: <FaHandshake />,
      title: "Connect & Sell",
      description: "Connect with buyers, negotiate prices, and complete transactions safely."
    },
    {
      icon: <FaShoppingCart />,
      title: "Buy Items",
      description: "Browse listings, contact sellers, and purchase items you need at great prices."
    }
  ];

  return (
    <div className="how-it-works-page">
      <Container>
        <section className="hero-section">
          <h1>How UniResell Works</h1>
          <p className="lead">
            Your go-to platform for buying and selling within your university community.
            Follow these simple steps to get started.
          </p>
        </section>

        <section className="steps-section">
          <Row className="g-4">
            {steps.map((step, index) => (
              <Col key={index} md={6} lg={3}>
                <Card className="step-card">
                  <Card.Body>
                    <div className="step-number">{index + 1}</div>
                    <div className="step-icon">{step.icon}</div>
                    <Card.Title>{step.title}</Card.Title>
                    <Card.Text>{step.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section className="features-section">
          <h2>Platform Features</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-item">
                <h3>Secure Transactions</h3>
                <p>All transactions are monitored and protected through our secure platform.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-item">
                <h3>Verified Users</h3>
                <p>All users are verified through their university email addresses.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-item">
                <h3>Rating System</h3>
                <p>Build trust through our user rating and review system.</p>
              </div>
            </Col>
          </Row>
        </section>

        <section className="tips-section">
          <h2>Tips for Success</h2>
          <Row className="g-4">
            <Col md={6}>
              <Card className="tips-card">
                <Card.Body>
                  <h3>For Sellers</h3>
                  <ul>
                    <li>Take clear, well-lit photos</li>
                    <li>Write detailed descriptions</li>
                    <li>Price items fairly</li>
                    <li>Respond to inquiries promptly</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="tips-card">
                <Card.Body>
                  <h3>For Buyers</h3>
                  <ul>
                    <li>Check item descriptions carefully</li>
                    <li>Ask questions before buying</li>
                    <li>Meet in safe locations</li>
                    <li>Rate your experience</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default HowItWorks; 