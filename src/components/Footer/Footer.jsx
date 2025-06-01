// src/components/Footer/Footer.jsx
// This is a React functional component named Footer that renders the footer section of a website. 
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links-contact-container">
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <div className="quick-links-columns">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/books">Books</a></li>
                <li><a href="/about">About Us</a></li>
              </ul>
              <ul>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/signin">Sign In</a></li>
                <li><a href="/signup">Sign Up</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-section contact">
            <h3>Contact</h3>
            <p>Email: support@visbook.ca</p>
            <p>Phone: +1 (403) 456-9153</p>
            <p>Location: 254 Book Lane, Visual City</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VisBook. All rights reserved.</p>
      </div>
    </footer>
  );
}