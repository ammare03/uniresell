import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound-content">
        <FaExclamationTriangle size={50} color="var(--primary)" />
        <div className="notfound-error">404</div>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="back-home-btn">
          <FaHome className="me-2" /> Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;