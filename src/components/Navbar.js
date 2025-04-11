import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaTshirt, 
  FaUserPlus, 
  FaHome,
  FaStore,
  FaClipboardList,
  FaInfoCircle,
  FaBook,
  FaListAlt,
  FaEnvelope,
  FaQuestionCircle,
  FaLock,
  FaSignInAlt,
  FaUserCircle,
  FaBox,
  FaTag,
  FaDollarSign
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import UserProfileMenu from './UserProfileMenu';
import '../styles/navbar.css';
import styled from 'styled-components';

// Define styled components
const NavMenu = styled.ul`
  list-style: none;
  padding: 0.5rem;
  margin: 0.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
`;

const NavItem = styled.li`
  margin-bottom: 0.2rem;
  width: 100%;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  width: 100%;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-light);
    color: var(--text-light);
    transform: translateX(5px);
  }

  & svg {
    color: var(--primary);
    font-size: 1.2rem;
    transition: all 0.2s;
  }

  &:hover svg {
    color: var(--text-light);
  }
`;

// Create a styled div for disabled links
const DisabledNavLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  color: var(--text-hint);
  text-decoration: none;
  border-radius: var(--radius-md);
  width: 100%;
  cursor: not-allowed;
  opacity: 0.7;
  position: relative;
  font-weight: 500;
  
  &:hover {
    background-color: var(--surface-dark);
  }
  
  &:hover::after {
    content: "Please log in to access this feature";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-dark);
    color: var(--text-light);
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
  }

  & svg {
    color: var(--text-hint);
    font-size: 1.2rem;
  }
`;

const CartIcon = styled.div`
  position: relative;
  display: flex;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--secondary);
  color: var(--text-light);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  color: var(--error);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  width: 100%;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--error);
    color: white;
    transform: translateX(5px);
  }

  & svg {
    color: var(--error);
    font-size: 1.2rem;
    transition: all 0.2s;
  }

  &:hover svg {
    color: white;
  }
`;

// Additional styled components for the top-right navigation
const TopNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  font-weight: 500;
  
  &:hover {
    color: var(--primary);
    background-color: var(--surface);
  }

  & svg {
    font-size: 1.1rem;
  }
`;

const TopLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  
  &:hover {
    color: var(--error);
    background-color: var(--surface);
  }

  & svg {
    font-size: 1.1rem;
  }
`;

const UserGreetingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: var(--primary-light);
  color: var(--text-light);
  border-radius: var(--radius-lg);
  margin-bottom: 1rem;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const UserCircleIcon = styled(FaUserCircle)`
  font-size: 2rem;
  color: var(--text-light);
`;

const CategoryTitle = styled.div`
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 1.5rem 0 0.5rem;
  font-weight: 600;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before, &::after {
    content: '';
    height: 1px;
    background-color: var(--text-hint);
    flex: 1;
  }

  &::before {
    margin-right: 0.5rem;
  }

  &::after {
    margin-left: 0.5rem;
  }
`;

// Additional styled component for the divider
const Divider = styled.div`
  height: 1px;
  background-color: var(--surface-dark);
  margin: 1rem 0;
  border-radius: 1px;
`;

const Navbar = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartBadgeNew, setCartBadgeNew] = useState(false);
  const [firstName, setFirstName] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user's name from the ABC ID database
  useEffect(() => {
    const fetchUserName = async () => {
      if (isLoggedIn && user && user.abcId) {
        try {
          // Use fetch API directly with the correct path to access file in public folder
          const response = await fetch('/abcIdDatabase.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch database: ${response.status}`);
          }
          const data = await response.json();
          const userData = data.find(entry => entry["ABC ID"] === user.abcId);
          if (userData) {
            setFirstName(userData["First Name"]);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback for known users
          if (user.abcId === "428017786891") {
            setFirstName("Ammar");
          } else if (user.abcId === "580964130673") {
            setFirstName("Srihari");
          } else if (user.abcId === "765782746082") {
            setFirstName("Aryan");
          } else if (user.abcId === "543362278703") {
            setFirstName("Dhruv");
          }
        }
      }
    };

    fetchUserName();
  }, [isLoggedIn, user]);

  // Hide the floating menu when the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        // Check if the clicked element is not the hamburger button
        if (!event.target.closest('.hamburger-menu-button')) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Add useEffect to manage body class
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  // Listen for cart item added event
  useEffect(() => {
    const handleCartItemAdded = () => {
      setCartBadgeNew(true);
      
      // Remove the "new" class after animation completes
      setTimeout(() => {
        setCartBadgeNew(false);
      }, 1800); // 3 iterations of the 0.6s animation
    };
    
    window.addEventListener('cartItemAdded', handleCartItemAdded);
    
    return () => {
      window.removeEventListener('cartItemAdded', handleCartItemAdded);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setFirstName('');
    navigate('/');
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking anywhere outside on mobile
  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left side - Hamburger Menu */}
        <div className="navbar-left">
          <button className="hamburger-menu-button" onClick={toggleMenu} aria-label="Menu">
            <FaBars />
          </button>
        </div>
        
        {/* Center - Website Title */}
        <div className="navbar-center">
          <Link to="/" className="logo">
            Uni<span>Resell</span>
          </Link>
        </div>
        
        {/* Right side - Login/Logout Button */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <TopNavLink to="/cart" className="cart-link">
                <CartIcon>
                  <FaShoppingCart />
                  {cartItems.length > 0 && (
                    <CartBadge className={cartBadgeNew ? 'new' : ''}>
                      {cartItems.length}
                    </CartBadge>
                  )}
                </CartIcon>
              </TopNavLink>
              <UserProfileMenu />
              <TopLogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </TopLogoutButton>
            </>
          ) : (
            <TopNavLink to="/login">
              <FaUser />
              Login
            </TopNavLink>
          )}
        </div>
        
        {/* Overlay for when menu is open */}
        <div className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
        
        {/* Sidebar Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
          <button className="close-button" onClick={toggleMenu} aria-label="Close menu">
            <FaTimes />
          </button>
          
          {/* Greeting */}
          {isLoggedIn && firstName ? (
            <UserGreetingContainer>
              <UserCircleIcon />
              <div>Hello, {firstName}</div>
            </UserGreetingContainer>
          ) : (
            <UserGreetingContainer>
              <UserCircleIcon />
              <div>Welcome, Guest</div>
            </UserGreetingContainer>
          )}
          
          {/* Navigation Links */}
          <CategoryTitle>Navigation</CategoryTitle>
          <NavMenu>
            <NavItem>
              <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                <FaHome />
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/active-ads" onClick={() => setIsMenuOpen(false)}>
                <FaTag />
                Browse Ads
              </NavLink>
            </NavItem>
            <NavItem>
              {isLoggedIn ? (
                <NavLink to="/sell" onClick={() => setIsMenuOpen(false)}>
                  <FaDollarSign />
                  Sell Item
                </NavLink>
              ) : (
                <DisabledNavLink>
                  <FaLock />
                  Sell Item (Login Required)
                </DisabledNavLink>
              )}
            </NavItem>
          </NavMenu>
          
          {isLoggedIn ? (
            <>
              <CategoryTitle>Account</CategoryTitle>
              <NavMenu>
                <NavItem>
                  <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <FaUser />
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/cart" onClick={() => setIsMenuOpen(false)}>
                    <CartIcon>
                      <FaShoppingCart />
                      {cartItems.length > 0 && (
                        <CartBadge className={cartBadgeNew ? 'new' : ''}>
                          {cartItems.length}
                        </CartBadge>
                      )}
                    </CartIcon>
                    Cart
                  </NavLink>
                </NavItem>
                <NavItem>
                  <LogoutButton onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    <FaSignOutAlt />
                    Logout
                  </LogoutButton>
                </NavItem>
              </NavMenu>
            </>
          ) : (
            <>
              <CategoryTitle>Account</CategoryTitle>
              <NavMenu>
                <NavItem>
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    <FaSignInAlt />
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <FaUserPlus />
                    Register
                  </NavLink>
                </NavItem>
              </NavMenu>
            </>
          )}
          
          <CategoryTitle>Help &amp; Info</CategoryTitle>
          <NavMenu>
            <NavItem>
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                <FaInfoCircle />
                About Us
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/terms" onClick={() => setIsMenuOpen(false)}>
                <FaClipboardList />
                Terms &amp; Conditions
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/faq" onClick={() => setIsMenuOpen(false)}>
                <FaQuestionCircle />
                FAQ
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
                <FaEnvelope />
                Contact
              </NavLink>
            </NavItem>
          </NavMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 