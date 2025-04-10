// src/pages/Home.js
import React, { useContext, useState, useEffect } from 'react';
import ProductCarousel from '../components/ProductCarousel';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaUserPlus, FaUpload, FaShoppingCart, FaSearch, FaHandshake, FaShieldAlt, FaStar, FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Home.css';

// Importing local images from the 'images' folder
import textbooksImg from '../images/textbooks.jpg';
import notesImg from '../images/notes.jpg';
import communityImg from '../images/community.jpg';

function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State to store ads fetched from the backend
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState({
    users: 500,
    transactions: 1000,
    satisfaction: 98
  });

  // Fetch ads from the backend on page load
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ads');
        // Filter out sold products
        const activeAds = res.data.ads.filter(ad => !ad.sold);
        setAds(activeAds);  // Store active ads in state
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds();
  }, []);

  // Prepare ads for the carousel, only take the first 3 active products
  const products = ads.slice(0, 3).map(ad => ({
    image: ad.image,
    title: ad.title,
    description: ad.description,
  }));

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/sell');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="home">
      <section className="hero text-center py-5">
        <Container>
          <h1 className="display-4">Welcome to UniResell</h1>
          <p className="lead">
            Your trusted marketplace for pre-loved university books and notes.
          </p>
          <div className="hero-buttons">
            <Button variant="primary" size="lg" className='get-started-btn' onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button variant="outline-primary" size="lg" className='browse-btn' onClick={() => navigate('/active-ads')}>
              Browse Items
            </Button>
          </div>
        </Container>
      </section>
      
      <section className="stats-section py-4">
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <div className="stat-item">
                <h3>{stats.users}+</h3>
                <p>Active Users</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-item">
                <h3>{stats.transactions}+</h3>
                <p>Successful Transactions</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-item">
                <h3>{stats.satisfaction}%</h3>
                <p>User Satisfaction</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="carousel-section my-5">
        <Container>
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Check out our latest listings</p>
          <ProductCarousel items={products} />
        </Container>
      </section>

      <section className="how-it-works py-5">
        <Container>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Start selling or buying in three simple steps</p>
          <Row className="text-center">
            <Col md={4}>
              <div className="step" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>
                <FaUserPlus size={40} />
                <h4>Sign Up</h4>
                <p>Create an account to start listing your items.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step" onClick={() => navigate('/sell')} style={{ cursor: 'pointer' }}>
                <FaUpload size={40} />
                <h4>List Your Items</h4>
                <p>Upload your books, notes, and more with ease.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step" onClick={() => navigate('/active-ads')} style={{ cursor: 'pointer' }}>
                <FaShoppingCart size={40} />
                <h4>Sell & Connect</h4>
                <p>Sell your items and connect with other students.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section py-5">
        <Container>
          <h2 className="section-title">Why Choose UniResell?</h2>
          <p className="section-subtitle">Benefits that make us stand out</p>
          <Row className="text-center">
            <Col md={3}>
              <div className="feature-item">
                <FaSearch className="feature-icon" />
                <h4>Easy to Use</h4>
                <p>Simple and intuitive platform for buying and selling.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="feature-item">
                <FaHandshake className="feature-icon" />
                <h4>Secure Transactions</h4>
                <p>Safe and reliable payment processing.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <h4>Verified Users</h4>
                <p>All users are verified university students.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="feature-item">
                <FaStar className="feature-icon" />
                <h4>Rating System</h4>
                <p>Transparent user ratings and reviews.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="popular-categories py-5">
        <Container>
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">Find what you need</p>
          <Row className="justify-content-center">
            <Col xs={6} md={3}>
              <div className="category-card">
                <img src={textbooksImg} alt="Textbooks" className="category-img" />
                <h5>Textbooks</h5>
                <Badge bg="primary">Most Popular</Badge>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="category-card">
                <img src={notesImg} alt="Notes" className="category-img" />
                <h5>Notes</h5>
                <Badge bg="success">High Demand</Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h2>Ready to Get Started?</h2>
              <p>Join our growing community of university students buying and selling study materials.</p>
              <Button variant="primary" size="lg" onClick={handleGetStarted}>
                Join Now
              </Button>
            </Col>
            <Col md={5}>
              <div className="cta-image">
                <FaGraduationCap size={150} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="testimonials py-5">
        <Container>
          <h2 className="section-title">What Students Say</h2>
          <p className="section-subtitle">Hear from our community</p>
          <Row>
            <Col md={4}>
              <div className="testimonial-card">
                <div className="rating">★★★★★</div>
                <p>"Found all my semester books at great prices. Highly recommended!"</p>
                <h5>- Sarah M.</h5>
                <span>Computer Science</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-card">
                <div className="rating">★★★★★</div>
                <p>"Easy to use and great way to sell my old textbooks."</p>
                <h5>- John D.</h5>
                <span>Engineering</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-card">
                <div className="rating">★★★★★</div>
                <p>"Saved a lot of money buying second-hand books here!"</p>
                <h5>- Emily R.</h5>
                <span>Business</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;