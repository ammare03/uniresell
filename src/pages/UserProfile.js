// src/pages/UserProfile.js
import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Tab, Nav, Badge, Spinner } from 'react-bootstrap';
import { FaUser, FaShoppingBag, FaHistory, FaStar, FaCog } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserProfile.css';

function UserProfile() {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [userAds, setUserAds] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch full user details (including rating) from the backend
  useEffect(() => {
    if (user) {
      const fetchUserDetails = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/users/${user.abcId}?isOwner=true`);
          setUserDetails(res.data.user);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching user details.');
          setLoading(false);
        }
      };

      const fetchUserAds = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/ads');
          const myAds = res.data.ads.filter(ad => ad.postedBy === user.abcId);
          setUserAds(myAds);
        } catch (err) {
          console.error('Error fetching user ads:', err);
        }
      };

      const fetchOrderHistory = async () => {
        try {
          // Get all orders for the current user
          const res = await axios.get(`http://localhost:5000/api/orders/buyer/${user.abcId}`);
          if (res.data.orders) {
            // Enhanced order data with ad details
            const enhancedOrders = await Promise.all(
              res.data.orders.map(async (order) => {
                try {
                  // Fetch ad details for this order
                  const adRes = await axios.get(`http://localhost:5000/api/ads/${order.adId}`);
                  
                  // Fetch seller details
                  const sellerRes = await axios.get(`http://localhost:5000/api/users/${order.sellerId}`);
                  
                  return {
                    ...order,
                    adTitle: adRes.data.ad.title,
                    adImage: adRes.data.ad.image,
                    adPrice: adRes.data.ad.price,
                    sellerFirstName: sellerRes.data.user.firstName || '',
                    sellerLastName: sellerRes.data.user.lastName || ''
                  };
                } catch (err) {
                  console.error(`Error fetching details for order ${order._id}:`, err);
                  return order;
                }
              })
            );
            console.log('Enhanced orders:', enhancedOrders); // Add this for debugging
            setOrderHistory(enhancedOrders);
          } else {
            setOrderHistory([]);
          }
        } catch (err) {
          console.error('Error fetching order history:', err);
          setOrderHistory([]);
        }
      };

      fetchUserDetails();
      fetchUserAds();
      fetchOrderHistory();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteAd = async (adId) => {
    try {
      await axios.delete(`http://localhost:5000/api/ads/${adId}`);
      setUserAds(prevAds => prevAds.filter(ad => ad._id !== adId));
    } catch (err) {
      setError('Failed to delete ad. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="user-profile-page py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!userDetails) {
    return (
      <Container className="user-profile-page py-5">
        <p>Loading profile...</p>
      </Container>
    );
  }

  // Calculate statistics
  const activeAdsCount = userAds.filter(ad => !ad.sold).length;
  const soldAdsCount = userAds.filter(ad => ad.sold).length;
  const purchasesCount = orderHistory.length;

  return (
    <div className="user-profile-page">
      <Container className="profile-content">
        <Tab.Container id="profile-tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
          <Row className="mb-4">
            <Col md={12}>
              <Card className="profile-header-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2} className="text-center">
                      <div className="profile-avatar">
                        <FaUser size={50} />
                      </div>
                    </Col>
                    <Col md={7}>
                      <h2 className="profile-name">
                        {`${userDetails.firstName || ''} ${userDetails.lastName || ''}`}
                      </h2>
                      <p className="email-text">{userDetails.email}</p>
                      <div className="user-rating">
                        <FaStar className="star-icon" />
                        <span>{(userDetails.rating || 0).toFixed(1)}</span>
                        <small>({userDetails.totalRatings || 0} ratings)</small>
                      </div>
                    </Col>
                    <Col md={3} className="text-right">
                      <div className="profile-stats">
                        <div className="stat-item">
                          <span className="stat-value">{activeAdsCount}</span>
                          <span className="stat-label">Active Ads</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{soldAdsCount}</span>
                          <span className="stat-label">Sold</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{purchasesCount}</span>
                          <span className="stat-label">Purchases</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Nav variant="pills" className="flex-column profile-nav">
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="d-flex align-items-center">
                    <FaUser className="me-2" /> Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ads" className="d-flex align-items-center">
                    <FaShoppingBag className="me-2" /> My Ads
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="orders" className="d-flex align-items-center">
                    <FaHistory className="me-2" /> Order History
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings" className="d-flex align-items-center">
                    <FaCog className="me-2" /> Settings
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col md={9}>
              <Tab.Content>
                {/* Profile Tab */}
                <Tab.Pane eventKey="profile">
                  <Card className="profile-detail-card">
                    <Card.Header>
                      <h3>Personal Information</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className="profile-info">
                        <Row className="mb-3">
                          <Col md={3} className="info-label">ID:</Col>
                          <Col md={9}>{userDetails.abcId}</Col>
                        </Row>
                        
                        <Row className="mb-3">
                          <Col md={3} className="info-label">First Name:</Col>
                          <Col md={9}>{userDetails.firstName || 'Not specified'}</Col>
                        </Row>

                        <Row className="mb-3">
                          <Col md={3} className="info-label">Last Name:</Col>
                          <Col md={9}>{userDetails.lastName || 'Not specified'}</Col>
                        </Row>
                        
                        <Row className="mb-3">
                          <Col md={3} className="info-label">Email:</Col>
                          <Col md={9}>{userDetails.email}</Col>
                        </Row>

                        <Row className="mb-3">
                          <Col md={3} className="info-label">Credits:</Col>
                          <Col md={9}>{userDetails.credits || 0}</Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Ads Tab */}
                <Tab.Pane eventKey="ads">
                  <Card className="ads-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h3>My Advertisements</h3>
                      <Button variant="primary" onClick={() => window.location.href = '/sell'}>
                        Post New Ad
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {userAds.length === 0 ? (
                        <div className="no-content-message">
                          <p>You haven't posted any ads yet.</p>
                          <Button variant="outline-primary" onClick={() => window.location.href = '/sell'}>
                            Post Your First Ad
                          </Button>
                        </div>
                      ) : (
                        <Row>
                          {userAds.map((ad) => (
                            <Col key={ad._id} md={6} className="mb-4">
                              <Card className="ad-card">
                                <div className="ad-status-badge">
                                  {ad.sold ? 
                                    <Badge bg="secondary">Sold</Badge> : 
                                    <Badge bg="success">Active</Badge>
                                  }
                                </div>
                                <Card.Img variant="top" src={ad.image} className="ad-image" />
                                <Card.Body>
                                  <Card.Title>{ad.title}</Card.Title>
                                  <Card.Text className="ad-description">{ad.description}</Card.Text>
                                  <div className="ad-details">
                                    <span className="ad-price">₹{ad.price}</span>
                                    <span className="ad-date">Posted: {formatDate(ad.createdAt || new Date())}</span>
                                  </div>
                                  <div className="ad-actions">
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => window.location.href = `/ad/${ad._id}`}
                                    >
                                      View
                                    </Button>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleDeleteAd(ad._id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Orders Tab */}
                <Tab.Pane eventKey="orders">
                  <Card className="orders-card">
                    <Card.Header>
                      <h3>Order History</h3>
                    </Card.Header>
                    <Card.Body>
                      {orderHistory.length === 0 ? (
                        <div className="no-content-message">
                          <p>You haven't made any purchases yet.</p>
                          <Button variant="outline-primary" onClick={() => window.location.href = '/active-ads'}>
                            Browse Ads
                          </Button>
                        </div>
                      ) : (
                        <div className="order-list">
                          {console.log('Rendering order history:', orderHistory)}
                          {orderHistory.map((order) => (
                            <Card key={order._id} className="order-item mb-3">
                              <Card.Header className="d-flex justify-content-between">
                                <span>Order #{order._id ? order._id.substring(0, 8) : 'N/A'}</span>
                                <span>{formatDate(order.purchaseDate || order.createdAt || new Date())}</span>
                              </Card.Header>
                              <Card.Body>
                                <Row className="align-items-center">
                                  <Col md={2}>
                                    {order.adImage && (
                                      <img 
                                        src={order.adImage} 
                                        alt={order.adTitle || order.title || 'Product'} 
                                        className="order-image"
                                      />
                                    )}
                                  </Col>
                                  <Col md={6}>
                                    <h5>{order.adTitle || order.title || 'Product'}</h5>
                                    <p>Seller: {order.sellerFirstName || ''} {order.sellerLastName || ''}</p>
                                    {order.razorpay_payment_id && (
                                      <small className="text-muted">
                                        Payment ID: {order.razorpay_payment_id.substring(0, 12)}...
                                      </small>
                                    )}
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <div className="order-price">₹{order.totalAmount || order.price || 0}</div>
                                    <Badge 
                                      bg={order.status === 'completed' ? 'success' : 'info'}
                                    >
                                      {order.status || 'completed'}
                                    </Badge>
                                    {order.paymentMethod && (
                                      <div className="payment-method">
                                        Paid via {order.paymentMethod}
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                
                {/* Settings Tab */}
                <Tab.Pane eventKey="settings">
                  <Card className="settings-card">
                    <Card.Header>
                      <h3>Account Settings</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className="settings-section">
                        <h4>Notification Preferences</h4>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="email-notifications" 
                            defaultChecked 
                          />
                          <label className="form-check-label" htmlFor="email-notifications">
                            Email Notifications
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="order-updates" 
                            defaultChecked 
                          />
                          <label className="form-check-label" htmlFor="order-updates">
                            Order Updates
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="new-features" 
                            defaultChecked 
                          />
                          <label className="form-check-label" htmlFor="new-features">
                            New Features and Updates
                          </label>
                        </div>
                      </div>
                      
                      <div className="settings-section mt-4">
                        <h4>Privacy Settings</h4>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="show-email" 
                          />
                          <label className="form-check-label" htmlFor="show-email">
                            Show Email to Other Users
                          </label>
                        </div>
                      </div>
                      
                      <div className="settings-section mt-4">
                        <h4>Account Actions</h4>
                        <Button variant="outline-danger">
                          Change Password
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
}

export default UserProfile;