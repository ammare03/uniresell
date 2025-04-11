// src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaListAlt, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser, FaInfoCircle, FaQuestionCircle, FaEnvelope, FaBook, FaBars, FaTimes, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import '../styles/Header.css';

function Header() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // Debug localStorage on mount
  useEffect(() => {
    console.log("LocalStorage 'user':", localStorage.getItem('user'));
    console.log("LocalStorage 'isLoggedIn':", localStorage.getItem('isLoggedIn'));
    
    try {
      const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("Parsed localStorage user:", userFromStorage);
    } catch (e) {
      console.error("Error parsing localStorage user:", e);
    }
  }, []);

  // Fetch user name from ABC ID
  useEffect(() => {
    const fetchUserName = async () => {
      console.log("Auth State:", { isLoggedIn, user });
      
      if (isLoggedIn && user) {
        // Check if user has ABC ID
        if (!user.abcId) {
          console.log("No abcId found on user object. Available properties:", Object.keys(user));
          return;
        }
        
        const abcId = user.abcId;
        console.log("Attempting to fetch user data for ABC ID:", abcId);
        
        try {
          // Use browser's fetch API instead of axios to get the file from public folder
          const response = await fetch('/abcIdDatabase.json');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log("Database response:", data ? `Found ${data.length} entries` : "No data");
          
          if (data && Array.isArray(data)) {
            // Log a sample entry
            console.log("Sample database entry:", data[0]);
            
            // Find the user with matching ABC ID
            const userData = data.find(entry => entry["ABC ID"] === abcId);
            console.log("Found user data:", userData);
            
            if (userData && userData["First Name"]) {
              console.log("Setting user name to:", userData["First Name"]);
              setUserName(userData["First Name"]);
            } else {
              console.log("No matching user found for ABC ID:", abcId);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          
          // Hard-coded fallback for testing
          if (abcId === "428017786891") {
            console.log("Using hardcoded fallback for Ammar");
            setUserName("Ammar");
          } else if (abcId === "580964130673") {
            setUserName("Srihari");
          } else if (abcId === "765782746082") {
            setUserName("Aryan");
          } else if (abcId === "543362278703") {
            setUserName("Dhruv");
          }
        }
      } else {
        console.log("User not logged in or missing data");
      }
    };

    fetchUserName();
  }, [isLoggedIn, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Hide the floating menu when the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.hamburger') && !event.target.closest('.floating-menu')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="custom-header">
      <div className="header-content container d-flex justify-content-between align-items-center">
        <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
        
        <Link to="/" className="site-title" style={{ textDecoration: 'none', cursor: 'pointer' }}>UniResell</Link>
        
        <div className="nav-extra">
          {isLoggedIn ? (
            <Link to="/cart" className="cart-link">
              <FaShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
          ) : (
            <Link to="/login" className="login-link">
              <FaSignInAlt size={24} />
              <span className="login-text">Login</span>
            </Link>
          )}
        </div>
      </div>
      
      {menuOpen && (
        <div className="floating-menu">
          <button className="close-button" onClick={() => setMenuOpen(false)}>
            <FaTimes />
          </button>
          
          <div className="menu-header">
            <div className="user-greeting">
              <span role="img" aria-label="Wave">👋</span> 
              {isLoggedIn ? `Welcome, ${userName || 'User'}` : 'Welcome, Guest'}
            </div>
          </div>
          
          <div className="menu-section">
            <h5>Navigation</h5>
            <div className="menu-item">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <FaHome className="menu-icon" /> Home
              </Link>
            </div>

            <div className="menu-item">
              <Link to="/active-ads" onClick={() => setMenuOpen(false)}>
                <FaListAlt className="menu-icon" /> Browse Ads
              </Link>
            </div>
            
            {isLoggedIn ? (
              <div className="menu-item">
                <Link to="/sell" onClick={() => setMenuOpen(false)}>
                  <FaShoppingCart className="menu-icon" /> Sell Item
                </Link>
              </div>
            ) : (
              <div className="menu-item">
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{opacity: 0.7}}>
                  <FaLock className="menu-icon" /> Sell Item (Login Required)
                </Link>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="menu-section">
              <h5>My Account</h5>
              <div className="menu-item">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <FaUser className="menu-icon" /> Profile
                </Link>
              </div>
              <div className="menu-item logout-item">
                <button onClick={() => { setMenuOpen(false); handleLogout(); }}>
                  <FaSignOutAlt className="menu-icon" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="menu-section">
              <h5>Account</h5>
              <div className="menu-item">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <FaSignInAlt className="menu-icon" /> Login
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <FaUserPlus className="menu-icon" /> Register
                </Link>
              </div>
            </div>
          )}
          
          <div className="menu-section">
            <h5>Help &amp; Info</h5>
            <div className="menu-item">
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                <FaInfoCircle className="menu-icon" /> About Us
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/terms" onClick={() => setMenuOpen(false)}>
                <FaBook className="menu-icon" /> Terms &amp; Conditions
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/faq" onClick={() => setMenuOpen(false)}>
                <FaQuestionCircle className="menu-icon" /> FAQ
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                <FaEnvelope className="menu-icon" /> Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;