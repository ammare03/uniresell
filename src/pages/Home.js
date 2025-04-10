// src/pages/Home.js
import React, { useContext, useState, useEffect } from 'react';
import ProductCarousel from '../components/ProductCarousel';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaUserPlus, FaUpload, FaShoppingCart } from 'react-icons/fa';
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
          <Button variant="light" size="lg" className='get-started-btn' onClick={handleGetStarted}>
            Get Started
          </Button>
        </Container>
      </section>
      
      <section className="carousel-section my-5">
        <Container>
          <h2 className="mb-4 text-center">Featured Products</h2>
          <ProductCarousel items={products} />
        </Container>
      </section>

      <section className="how-it-works py-5">
        <Container>
          <h2 className="mb-4 text-center">How It Works</h2>
          <Row className="text-center">
            <Col md={4}>
              <div className="step">
                <FaUserPlus size={40} />
                <h4>Sign Up</h4>
                <p>Create an account to start listing your items.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step">
                <FaUpload size={40} />
                <h4>List Your Items</h4>
                <p>Upload your books, notes, and more with ease.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step">
                <FaShoppingCart size={40} />
                <h4>Sell & Connect</h4>
                <p>Sell your items and connect with other students.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="popular-categories py-5">
        <Container>
          <h2 className="mb-4 text-center">Popular Categories</h2>
          <Row className="justify-content-center">
            <Col xs={6} md={3}>
              <div className="category-card">
                <img src={textbooksImg} alt="Textbooks" className="category-img" />
                <h5 className="mt-2">Textbooks</h5>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="category-card">
                <img src={notesImg} alt="Notes" className="category-img" />
                <h5 className="mt-2">Notes</h5>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="additional-info py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2>Join our Community</h2>
              <p>
                Buy, sell, and exchange study materials with fellow students.
              </p>
            </Col>
            <Col md={6}>
              <img
                src={communityImg}
                alt="Community"
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;