import React from 'react';
import ProductCarousel from '../components/ProductCarousel';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/Home.css';

function Home() {
  // Use placeholder images (you can change these later)
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

  return (
    <div className="home">
      <section className="hero text-center py-5">
        <Container>
          <h1 className="display-4">Welcome to UniResell</h1>
          <p className="lead">
            Your trusted marketplace for pre-loved university books and notes.
          </p>
          <Button variant="light" size="lg">Get Started</Button>
        </Container>
      </section>
      
      <section className="carousel-section my-5">
        <Container>
          <h2 className="mb-4 text-center">Featured Products</h2>
          <ProductCarousel items={products} />
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