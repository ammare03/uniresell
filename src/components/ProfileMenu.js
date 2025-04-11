import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHistory, FaCog } from 'react-icons/fa';
import '../styles/ProfileMenu.css';

const ProfileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-menu-dropdown">
      <Link to="/profile" className="profile-menu-item" onClick={onClose}>
        <FaUser /> Profile
      </Link>
      <Link to="/profile/ads" className="profile-menu-item" onClick={onClose}>
        <FaShoppingBag /> My Ads
      </Link>
      <Link to="/profile/orders" className="profile-menu-item" onClick={onClose}>
        <FaHistory /> Order History
      </Link>
      <Link to="/profile/settings" className="profile-menu-item" onClick={onClose}>
        <FaCog /> Settings
      </Link>
    </div>
  );
};

export default ProfileMenu; 