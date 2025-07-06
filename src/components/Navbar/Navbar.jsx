// Navbar for VisBook: handles both desktop and mobile navigation, user menu, and cart badge.

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

import visBookLogo from '/assets/images/vblogo.png';
import booksIcon from '/assets/images/icons/books-icon.png';
import aboutIcon from '/assets/images/icons/about-icon.png';
import contactIcon from '/assets/images/icons/contact-icon.png';
import signinIcon from '/assets/images/icons/signin-icon.png';
import cartIcon from '/assets/images/icons/cart-icon.png';

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const { currentUser, userProfile, signout } = useAuth();

  // Update cart count from localStorage (reacts to cart changes and user changes)
  useEffect(() => {
    function updateCartCount() {
      let cartKey = 'cart';
      if (currentUser && currentUser.uid) {
        cartKey = `cart_${currentUser.uid}`;
      }
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        const cartArr = JSON.parse(storedCart);
        // Sum all quantities, defaulting to 1 if not set
        const total = cartArr.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    }
    updateCartCount();
    // Listen for cart changes (custom event and storage)
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [currentUser]);

  // Wait for auth to load before showing user info
  useEffect(() => {
    if (currentUser !== undefined) {
      setLoadingUser(false);
    }
  }, [currentUser]);

  // Close dropdown on click outside
  // Close the user dropdown if you click outside or hit Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  // Log out and clean up UI state
  const handleLogout = () => {
    signout();
    window.dispatchEvent(new Event('cartUpdated'));
    setDropdownOpen(false);
    setMenuOpen(false);
    setTimeout(() => navigate('/signin'), 0);
  };

  // Get user's first name for greeting (from displayName or email)
  const getFirstName = () => {
    if (loadingUser) return '';
    if (userProfile?.displayName && userProfile.displayName.trim() !== '') {
      return userProfile.displayName.split(' ')[0];
    }
    // Only show email username if displayName is not set and user signed up with email/password (not Google)
    if (currentUser?.email && (!currentUser.providerData || currentUser.providerData[0]?.providerId === 'password')) {
      return currentUser.email.split('@')[0];
    }
    return '';
  };

  return (
    <>
      {/* Main site header and nav */}
      <header className="header">
        <div className="nav-content">
          {/* Hamburger menu for mobile */}
          <div
            className={`hamburger-menu ${menuOpen ? "open" : ""}`}
            onClick={() => {
              setMenuOpen(!menuOpen);
              if (menuOpen && mobileUserDropdownOpen) {
                setMobileUserDropdownOpen(false); // Close submenu if open when closing main menu
              }
            }}
          >
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
          </div>
          <div className="nav-row-container">
            {/* Logo and site title */}
            <Link to="/" className="home-link">
              <img className="vblogo" src={visBookLogo} alt="VisBook Logo" />
              <h1 className="title">visbook</h1>
            </Link>
            {/* Desktop navigation links */}
            <nav className="desktop-nav">
              <ul>
                {/* Dashboard link removed */}
                <li>
                  <Link to="/books" className="icon-link">
                    <img src={booksIcon} alt="Books" className="nav-icon" />
                    <span className="nav-label">Books</span>
                    <span className="custom-tooltip">Books</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="icon-link">
                    <img src={aboutIcon} alt="About" className="nav-icon" />
                    <span className="nav-label">About</span>
                    <span className="custom-tooltip">About</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="icon-link">
                    <img src={contactIcon} alt="Contact" className="nav-icon" />
                    <span className="nav-label">Contact</span>
                    <span className="custom-tooltip">Contact</span>
                  </Link>
                </li>
                {/* User dropdown if logged in, otherwise Sign In link */}
                {currentUser && currentUser.emailVerified && !loadingUser && getFirstName() ? (
                  <li
                    className="nav-user-dropdown"
                    ref={userDropdownRef}
                    style={{ position: 'relative', display: 'flex', alignItems: 'stretch', height: '100%' }}
                  >
                    {/* User button shows greeting and opens dropdown */}
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
                    {/* Dropdown menu for user actions */}
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
                ) : (
                  <li>
                    <Link to="/signin" className="icon-link">
                      <img src={signinIcon} alt="Sign In" className="nav-icon" />
                      <span className="nav-label">Sign In</span>
                      <span className="custom-tooltip">Sign In</span>
                    </Link>
                  </li>
                )}
                {/* Cart link with badge */}
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
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile nav panel slides in when hamburger is open */}
      <div className={`mobile-panel${menuOpen || mobileUserDropdownOpen ? " open" : ""}`}> 
        <nav className="mobile-nav">
          <ul className="mobile-main-menu-list">
            <li className="mobile-main-menu-item mobile-main-menu-books">
              <Link to="/books" onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
                <span className="mobile-main-menu-icon"><img src={booksIcon} alt="Books" className="nav-icon mobile-main-menu-img" /></span>
                <span className="mobile-main-menu-label">Books</span>
              </Link>
            </li>
            <li className="mobile-main-menu-item mobile-main-menu-about">
              <Link to="/about" onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
                <span className="mobile-main-menu-icon"><img src={aboutIcon} alt="About" className="nav-icon mobile-main-menu-img" /></span>
                <span className="mobile-main-menu-label">About</span>
              </Link>
            </li>
            <li className="mobile-main-menu-item mobile-main-menu-contact">
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
                <span className="mobile-main-menu-icon"><img src={contactIcon} alt="Contact" className="nav-icon mobile-main-menu-img" /></span>
                <span className="mobile-main-menu-label">Contact</span>
              </Link>
            </li>
            {currentUser && currentUser.emailVerified && !loadingUser && getFirstName() ? (
              <li className="mobile-main-menu-item mobile-main-menu-user">
                <button
                  type="button"
                  className="full-link mobile-user-btn mobile-main-menu-link"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMobileUserDropdownOpen(true);
                  }}
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
            ) : (
              <li className="mobile-main-menu-item mobile-main-menu-signin">
                <Link to="/signin" onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
                  <span className="mobile-main-menu-icon"><img src={signinIcon} alt="Sign In" className="nav-icon mobile-main-menu-img" /></span>
                  <span className="mobile-main-menu-label">Sign In</span>
                </Link>
              </li>
            )}
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
          </ul>
        </nav>
      </div>
      {/* Mobile submenu overlay for user */}
      {mobileUserDropdownOpen && (
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
            <Link to="/account" className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onClick={() => { setMobileUserDropdownOpen(false); setMenuOpen(false); }}>
              Account Settings
            </Link>
            <Link to="/account/orders" className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onClick={() => { setMobileUserDropdownOpen(false); setMenuOpen(false); }}>
              Order History
            </Link>
            <button className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onMouseDown={e => {
              e.preventDefault();
              setMobileUserDropdownOpen(false);
              setMenuOpen(false);
              setTimeout(() => handleLogout(), 0);
            }}>
              Log-out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

