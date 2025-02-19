import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../styles/ProductCarousel.css';

function ProductCarousel({ items }) {
  return (
    <Carousel interval={3000} className="product-carousel">
      {items.map((item, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={item.image}
            alt={item.title}
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;