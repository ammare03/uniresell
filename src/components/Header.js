// src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaListAlt, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser, FaInfoCircle, FaQuestionCircle, FaEnvelope, FaBook } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import '../styles/Header.css';

function Header() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="custom-header">
      <div className="header-content container d-flex justify-content-between align-items-center">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <Link to="/" className="site-title" style={{ textDecoration: 'none', cursor: 'pointer' }}>UniResell</Link>
        <div className="nav-extra">
          <Link to="/cart" className="cart-link">
            <FaShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div className="floating-menu">
          <div className="menu-item">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <FaHome className="menu-icon" /> Home
            </Link>
          </div>

          {/* Browse Ads */}
          <div className="menu-item">
            <Link to="/active-ads" onClick={() => setMenuOpen(false)}>
              <FaListAlt className="menu-icon" /> Browse Ads
            </Link>
          </div>

          {/* Information Links */}
          <div className="menu-item">
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              <FaInfoCircle className="menu-icon" /> About Us
            </Link>
          </div>
          <div className="menu-item">
            <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>
              <FaBook className="menu-icon" /> How It Works
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

          {/* User Navigation */}
          {isLoggedIn ? (
            <>
              <div className="menu-item">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <FaUser className="menu-icon" /> Profile
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/sell" onClick={() => setMenuOpen(false)}>
                  <FaShoppingCart className="menu-icon" /> Sell
                </Link>
              </div>
              <div className="menu-item">
                <button onClick={() => { setMenuOpen(false); handleLogout(); }}>
                  <FaSignOutAlt className="menu-icon" /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="menu-item">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <FaSignInAlt className="menu-icon" /> Login
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <FaUserPlus className="menu-icon" /> Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;