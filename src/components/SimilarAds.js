import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SimilarAds.css';

function SimilarAds({ currentAdId, category }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilarAds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ads');
        const similarAds = res.data.ads
          .filter(ad => ad.category === category && ad._id !== currentAdId && !ad.sold)
          .slice(0, 4); // Show up to 4 similar ads
        setAds(similarAds);
      } catch (err) {
        console.error('Error fetching similar ads:', err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchSimilarAds();
    }
  }, [category, currentAdId]);

  if (loading) {
    return <Spinner animation="border" variant="dark" />;
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className="similar-ads">
      <h3 className="mb-4">Similar Items</h3>
      <Row xs={1} md={2} lg={4} className="g-4">
        {ads.map(ad => (
          <Col key={ad._id}>
            <Card 
              className="similar-ad-card h-100" 
              onClick={() => navigate(`/ad/${ad._id}`)}
            >
              <div className="card-img-container">
                <Card.Img variant="top" src={ad.image} className="similar-ad-image" />
              </div>
              <Card.Body>
                <Card.Title className="text-truncate">{ad.title}</Card.Title>
                <Card.Text className="price">₹{ad.price}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default SimilarAds; 