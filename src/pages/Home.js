// src/pages/Home.js
import React, { useContext } from 'react';
import ProductCarousel from '../components/ProductCarousel';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaUserPlus, FaUpload, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const products = [
    {
      image: 'https://picsum.photos/seed/1/1200/500',
      title: 'Product 1',
      description: 'This is a great product for students.',
    },
    {
      image: 'https://picsum.photos/seed/2/1200/500',
      title: 'Product 2',
      description: 'Find quality used books and notes here.',
    },
    {
      image: 'https://picsum.photos/seed/3/1200/500',
      title: 'Product 3',
      description: 'Discover amazing deals on study materials.',
    },
    {
      image: 'https://picsum.photos/seed/4/1200/500',
      title: 'Product 4',
      description: 'Quality products at affordable prices.',
    },
  ];

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
                <img src="https://picsum.photos/seed/cat1/300/200" alt="Textbooks" />
                <h5 className="mt-2">Textbooks</h5>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="category-card">
                <img src="https://picsum.photos/seed/cat2/300/200" alt="Notes" />
                <h5 className="mt-2">Notes</h5>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="category-card">
                <img src="https://picsum.photos/seed/cat3/300/200" alt="Stationery" />
                <h5 className="mt-2">Stationery</h5>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="category-card">
                <img src="https://picsum.photos/seed/cat4/300/200" alt="Accessories" />
                <h5 className="mt-2">Accessories</h5>
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
                src="https://picsum.photos/seed/community/600/400"
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