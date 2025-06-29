//src/component/Navbar/Navbar.jsx
// This Navbar component provides a responsive navigation menu for the VisBook website, with icon-based links and mobile support.

import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './NavBar.css';

import visBookLogo from '/assets/images/vblogo.png';
import booksIcon from '/assets/images/icons/books-icon.png';
import aboutIcon from '/assets/images/icons/about-icon.png';
import contactIcon from '/assets/images/icons/contact-icon.png';
import signinIcon from '/assets/images/icons/signin-icon.png';
import signupIcon from '/assets/images/icons/signup-icon.png';
import cartIcon from '/assets/images/icons/cart-icon.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="nav-content">
          <div
            className={`hamburger-menu ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
          </div>

          <Link to="/" className="home-link">
            <img className="vblogo" src={visBookLogo} alt="VisBook Logo" />
            <h1 className="title">visbook</h1>
          </Link>

          <nav className="desktop-nav">
            <ul>
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
              <li>
                <Link to="/signin" className="icon-link">
                  <img src={signinIcon} alt="Sign In" className="nav-icon" />
                  <span className="nav-label">Sign In</span>
                  <span className="custom-tooltip">Sign In</span>
                </Link>
              </li>
              <li>
                <Link to="/signup" className="icon-link">
                  <img src={signupIcon} alt="Sign Up" className="nav-icon" />
                  <span className="nav-label">Sign Up</span>
                  <span className="custom-tooltip">Sign Up</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="icon-link">
                  <img src={cartIcon} alt="Cart" className="nav-icon" />
                  <span className="nav-label">Cart</span>
                  <span className="custom-tooltip">Cart</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className={`mobile-panel ${menuOpen ? "open" : ""}`}>
        <nav className="mobile-nav">
          <ul>
            <li>
              <Link to="/books" onClick={() => setMenuOpen(false)} className="full-link">
                <img src={booksIcon} alt="Books" className="nav-icon" />
                <span>Books</span>
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="full-link">
                <img src={aboutIcon} alt="About" className="nav-icon" />
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="full-link">
                <img src={contactIcon} alt="Contact" className="nav-icon" />
                <span>Contact</span>
              </Link>
            </li>
            <li>
              <Link to="/signin" onClick={() => setMenuOpen(false)} className="full-link">
                <img src={signinIcon} alt="Sign In" className="nav-icon" />
                <span>Sign In</span>
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="full-link">
                <img src={signupIcon} alt="Sign Up" className="nav-icon" />
                <span>Sign Up</span>
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="full-link">
                <img src={cartIcon} alt="Cart" className="nav-icon" />
                <span>Cart</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

