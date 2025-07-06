// Navbar for VisBook: handles both desktop and mobile navigation, user menu, and cart badge.

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

// Import assets
import visBookLogo from '/assets/images/vblogo.png';
import booksIcon from '/assets/images/icons/books-icon.png';
import aboutIcon from '/assets/images/icons/about-icon.png';
import contactIcon from '/assets/images/icons/contact-icon.png';
import signinIcon from '/assets/images/icons/signin-icon.png';
import cartIcon from '/assets/images/icons/cart-icon.png';

export default function Navbar() {
  const navigate = useNavigate();
  
  // State management
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  
  // Refs and context
  const userDropdownRef = useRef(null);
  const { currentUser, userProfile, signout } = useAuth();

  // Cart count management
  useEffect(() => {
    const updateCartCount = () => {
      let cartKey = 'cart';
      if (currentUser && currentUser.uid) {
        cartKey = `cart_${currentUser.uid}`;
      }
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        const cartArr = JSON.parse(storedCart);
        const total = cartArr.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [currentUser]);

  // User loading state management
  useEffect(() => {
    if (currentUser !== undefined) {
      setLoadingUser(false);
    }
  }, [currentUser]);

  // Dropdown click outside handler
  useEffect(() => {
    if (!dropdownOpen) return;
    
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  // Event handlers
  const handleLogout = () => {
    signout();
    window.dispatchEvent(new Event('cartUpdated'));
    setDropdownOpen(false);
    setMenuOpen(false);
    setTimeout(() => navigate('/signin'), 0);
  };

  const handleHamburgerClick = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen && mobileUserDropdownOpen) {
      setMobileUserDropdownOpen(false);
    }
  };

  const handleUserMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileUserDropdownOpen(true);
  };

  const closeMobileMenus = () => {
    setMobileUserDropdownOpen(false);
    setMenuOpen(false);
  };

  // Utility functions
  const getFirstName = () => {
    if (loadingUser) return '';
    if (userProfile?.displayName && userProfile.displayName.trim() !== '') {
      return userProfile.displayName.split(' ')[0];
    }
    if (currentUser?.email && (!currentUser.providerData || currentUser.providerData[0]?.providerId === 'password')) {
      return currentUser.email.split('@')[0];
    }
    return '';
  };

  const isUserLoggedIn = () => {
    return currentUser && currentUser.emailVerified && !loadingUser && getFirstName();
  };

  // Component render methods
  const renderDesktopNavItem = (to, icon, label) => (
    <li key={label}>
      <Link to={to} className="icon-link">
        <img src={icon} alt={label} className="nav-icon" />
        <span className="nav-label">{label}</span>
        <span className="custom-tooltip">{label}</span>
      </Link>
    </li>
  );

  const renderUserDropdown = () => (
    <li
      className="nav-user-dropdown"
      ref={userDropdownRef}
      style={{ position: 'relative', display: 'flex', alignItems: 'stretch', height: '100%' }}
    >
      <button
        className="icon-link user-btn"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        aria-controls="user-dropdown-menu"
        onClick={() => setDropdownOpen((v) => !v)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDropdownOpen(v => !v);
          }
        }}
        tabIndex={0}
        style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}
      >
        <img src={signinIcon} alt="User" className="nav-icon" />
        <span className="nav-label">Hi, {getFirstName()}</span>
        <span className="custom-tooltip">Hi, {getFirstName()}</span>
      </button>
      <div
        id="user-dropdown-menu"
        className="user-dropdown-menu"
        style={{
          opacity: dropdownOpen ? 1 : 0,
          pointerEvents: dropdownOpen ? 'auto' : 'none',
          left: 0,
          right: 'auto',
          minWidth: 170,
          position: 'absolute',
          top: '110%',
          transition: 'opacity 0.2s',
          zIndex: 100,
          padding: '1rem 0'
        }}
        tabIndex={-1}
        role="menu"
        aria-label="User menu"
      >
        <Link to="/account" className="dropdown-item" role="menuitem" tabIndex={dropdownOpen ? 0 : -1} onClick={() => setDropdownOpen(false)}>
          Account Settings
        </Link>
        <Link to="/account/orders" className="dropdown-item" role="menuitem" tabIndex={dropdownOpen ? 0 : -1} onClick={() => setDropdownOpen(false)}>
          Order History
        </Link>
        <button className="dropdown-item" role="menuitem" tabIndex={dropdownOpen ? 0 : -1} onMouseDown={e => {
          e.preventDefault();
          setDropdownOpen(false);
          setMenuOpen(false);
          setTimeout(() => handleLogout(), 0);
        }}>
          Log-out
        </button>
      </div>
    </li>
  );

  const renderCartBadge = () => (
    <li style={{ position: 'relative' }}>
      <Link to="/cart" className="icon-link cart-link-badge">
        <span className="cart-icon-badge-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
          <img src={cartIcon} alt="Cart" className="nav-icon" />
          {cartCount > 0 && (
            <span className="cart-badge-overlay">{cartCount}</span>
          )}
        </span>
        <span className="nav-label">Cart</span>
        <span className="custom-tooltip">Cart</span>
      </Link>
    </li>
  );

  const renderMobileNavItem = (to, icon, label, className = '') => (
    <li className={`mobile-main-menu-item mobile-main-menu-${className || label.toLowerCase()}`}>
      <Link to={to} onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
        <span className="mobile-main-menu-icon">
          <img src={icon} alt={label} className="nav-icon mobile-main-menu-img" />
        </span>
        <span className="mobile-main-menu-label">{label}</span>
      </Link>
    </li>
  );

  const renderMobileUserButton = () => (
    <li className="mobile-main-menu-item mobile-main-menu-user">
      <button
        type="button"
        className="full-link mobile-user-btn mobile-main-menu-link"
        onClick={handleUserMenuClick}
        aria-haspopup="true"
        aria-expanded={mobileUserDropdownOpen}
        aria-controls="mobile-user-dropdown-menu"
      >
        <span className="mobile-main-menu-icon mobile-main-menu-user-icon">
          <img src={signinIcon} alt="User" className="nav-icon mobile-main-menu-img" />
          Hi, {getFirstName()}
        </span>
        <span className="mobile-main-menu-arrow">&#8594;</span>
      </button>
    </li>
  );

  const renderMobileCartItem = () => (
    <li className="mobile-main-menu-item mobile-main-menu-cart">
      <Link to="/cart" onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
        <span className="mobile-main-menu-icon">
          <span className="cart-icon-badge-wrapper">
            <img src={cartIcon} alt="Cart" className="nav-icon mobile-main-menu-img" />
            {cartCount > 0 && (
              <span className="cart-badge-overlay mobile-main-menu-cart-badge">{cartCount}</span>
            )}
          </span>
        </span>
        <span className="mobile-main-menu-label">Cart</span>
      </Link>
    </li>
  );

  const renderMobileUserDropdown = () => (
    <div className="mobile-user-dropdown-overlay">
      <div className="mobile-user-dropdown-header">
        <button
          aria-label="Back to main menu"
          className="mobile-user-dropdown-back"
          onClick={() => setMobileUserDropdownOpen(false)}
        >
          <span className="mobile-user-dropdown-back-arrow">&#8592;</span>
        </button>
        <span
          className="mobile-user-dropdown-title"
          tabIndex={0}
          role="button"
          onClick={() => setMobileUserDropdownOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setMobileUserDropdownOpen(false);
          }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <img src={signinIcon} alt="User" className="nav-icon mobile-main-menu-img" />
          Hi, {getFirstName()}
        </span>
      </div>
      <div className="mobile-user-dropdown-menu-list">
        <Link to="/account" className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onClick={closeMobileMenus}>
          Account Settings
        </Link>
        <Link to="/account/orders" className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onClick={closeMobileMenus}>
          Order History
        </Link>
        <button className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onMouseDown={e => {
          e.preventDefault();
          closeMobileMenus();
          setTimeout(() => handleLogout(), 0);
        }}>
          Log-out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="header">
        <div className="nav-content">
          <div
            className={`hamburger-menu ${menuOpen ? "open" : ""}`}
            onClick={handleHamburgerClick}
          >
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
          </div>
          <div className="nav-row-container">
            <Link to="/" className="home-link">
              <img className="vblogo" src={visBookLogo} alt="VisBook Logo" />
              <h1 className="title">visbook</h1>
            </Link>
            <nav className="desktop-nav">
              <ul>
                {renderDesktopNavItem("/books", booksIcon, "Books")}
                {renderDesktopNavItem("/about", aboutIcon, "About")}
                {renderDesktopNavItem("/contact", contactIcon, "Contact")}
                {isUserLoggedIn() ? renderUserDropdown() : renderDesktopNavItem("/signin", signinIcon, "Sign In")}
                {renderCartBadge()}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className={`mobile-panel${menuOpen || mobileUserDropdownOpen ? " open" : ""}`}>
        <nav className="mobile-nav">
          <ul className="mobile-main-menu-list">
            {renderMobileNavItem("/books", booksIcon, "Books")}
            {renderMobileNavItem("/about", aboutIcon, "About")}
            {renderMobileNavItem("/contact", contactIcon, "Contact")}
            {isUserLoggedIn() ? renderMobileUserButton() : renderMobileNavItem("/signin", signinIcon, "Sign In", "signin")}
            {renderMobileCartItem()}
          </ul>
        </nav>
      </div>

      {mobileUserDropdownOpen && renderMobileUserDropdown()}
    </>
  );
}

