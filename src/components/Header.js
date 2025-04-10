// src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaListAlt, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
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
        <div className="site-title">UniResell</div>
        <div className="nav-extra">
          <Link to="/cart" className="cart-link">
            <FaShoppingCart size={24} />
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
          {isLoggedIn && (
            <div className="menu-item">
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <FaUser className="menu-icon" /> Profile
              </Link>
            </div>
          )}
          <div className="menu-item">
            <Link to="/sell" onClick={() => setMenuOpen(false)}>
              <FaShoppingCart className="menu-icon" /> Sell
            </Link>
          </div>
          {isLoggedIn && (
            <div className="menu-item">
              <Link to="/active-ads" onClick={() => setMenuOpen(false)}>
                <FaListAlt className="menu-icon" /> Active Ads
              </Link>
            </div>
          )}
          {isLoggedIn ? (
            <div className="menu-item">
              <button onClick={() => { setMenuOpen(false); handleLogout(); }}>
                <FaSignOutAlt className="menu-icon" /> Logout
              </button>
            </div>
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