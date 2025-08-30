// src/components/Footer.js

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';
import greenTealIcon from './assets/emoji-icon.png'; 

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-logo-container">
          <img src={greenTealIcon} alt="BetterMind ZM Logo" className="footer-logo" width={60} height={60} />
          <div className="footer-logo-text">
            <h2>BetterMind ZM</h2>
            <p>Your Mental Wellness Partner</p>
          </div>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-socials">
          <h4>Connect with Us</h4>
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BetterMind ZM. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;