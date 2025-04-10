// src/pages/ActiveAds.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaArrowUp, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import '../styles/ActiveAds.css';

function ActiveAds() {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ADS_PER_PAGE = 12;

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Fetch ads from the backend
  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/ads');
      // Filter out sold ads
      const activeAds = res.data.ads.filter(ad => !ad.sold);
      setAds(activeAds);
      setFilteredAds(activeAds);
    } catch (err) {
      setError('Error fetching ads. Please try again later.');
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchAds]);

  // Handle scroll events
  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 400);

    // Infinite scroll
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
      if (hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }
  };

  // Handle search and filters
  const applyFilters = useCallback(() => {
    let result = [...ads];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(ad =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price range filter
    if (priceRange.min !== '') {
      result = result.filter(ad => ad.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(ad => ad.price <= Number(priceRange.max));
    }

    // Only show unsold ads
    result = result.filter(ad => !ad.sold);

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.sellerRating || 0) - (a.sellerRating || 0));
        break;
      default:
        break;
    }

    setFilteredAds(result);
    setHasMore(result.length > page * ADS_PER_PAGE);
  }, [ads, searchQuery, sortBy, priceRange, page]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleAddToCart = (ad) => {
    addToCart(ad);
    alert(`Ad "${ad.title}" added to cart!`);
  };

  const handleViewProduct = (adId) => {
    navigate(`/ad/${adId}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayedAds = filteredAds.slice(0, page * ADS_PER_PAGE);

  return (
    <div className="active-ads-page">
      <Container>
        <h2 className="text-center mb-4">Active Ads</h2>

        {/* Filters Section */}
        <div className="filters-section mb-4">
          {/* Search Bar */}
          <div className="search-container">
            <Form.Control
              type="text"
              placeholder="Search for ads..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Sorting and Filtering Options */}
          <div className="filter-options">
            <Row>
              <Col md={6}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark" id="sort-dropdown">
                    Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSortChange('newest')}>Newest</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('price-low')}>Price: Low to High</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('price-high')}>Price: High to Low</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('rating')}>Seller Rating</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md={6}>
                <div className="price-filter">
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min Price"
                        name="min"
                        value={priceRange.min}
                        onChange={handlePriceRangeChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max Price"
                        name="max"
                        value={priceRange.max}
                        onChange={handlePriceRangeChange}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center mb-4">
            <Spinner animation="border" variant="dark" />
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredAds.length === 0 && (
          <Alert variant="info" className="text-center">
            No ads found matching your criteria.
          </Alert>
        )}

        {/* Ads Grid */}
        <div className="ads-grid">
          {displayedAds.map((ad) => {
            const isOwnAd = user && ad.postedBy === user.abcId;
            return (
              <Card key={ad._id} className="ad-card">
                <div className="card-img-container">
                  <Card.Img variant="top" src={ad.image} />
                </div>
                <Card.Body>
                  <Card.Title>{ad.title}</Card.Title>
                  <Card.Text>{ad.description}</Card.Text>
                  <div className="price-text">₹{ad.price}</div>
                  <div className="seller-info">
                    <div>Posted by: {ad.postedBy}</div>
                    <div>Rating: {ad.sellerRating ? ad.sellerRating.toFixed(1) : 'N/A'} / 5</div>
                  </div>
                  {isOwnAd ? (
                    <Alert variant="info" className="mb-0">This is your ad</Alert>
                  ) : (
                    <div className="button-container">
                      <Button 
                        variant="outline-dark"
                        onClick={() => handleAddToCart(ad)}
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="dark"
                        onClick={() => handleViewProduct(ad._id)}
                      >
                        View Product
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* Loading More Indicator */}
        {loading && page > 1 && (
          <div className="text-center mt-4">
            <Spinner animation="border" variant="dark" />
          </div>
        )}

        {/* Back to Top Button */}
        {showBackToTop && (
          <button className="back-to-top" onClick={scrollToTop}>
            <FaArrowUp />
          </button>
        )}
      </Container>
    </div>
  );
}

export default ActiveAds;