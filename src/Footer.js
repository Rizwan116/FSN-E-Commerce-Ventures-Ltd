import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "./assets/Asset8.png";
// import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        {/* Logo */}
        <div className="logo-container">
        <Link to="/">
    <img src={logo} alt="logo" />
  </Link>
        </div>
      </div>

      <div className="footer-social">
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
  <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaPinterestP /></a>
  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaYoutube /></a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaXTwitter /></a>
  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaLinkedinIn /></a>
</div>

      <div className="footer-container">
        {/* Keep this section commented as requested */}
        {/* <div className="footer-column">...</div> */}

        <div className="footer-column">
          {/* <h3 className="footer-heading">Learn</h3> */}
          <ul className="footer-list">
            <li><Link to="/our-story">Our Story</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/records">RANAVAT Records</Link></li>
            <li><Link to="/store-locator">Store Locator</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          {/* <h3 className="footer-heading">Quick links</h3> */}
          <ul className="footer-list">
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/order-details">Order Details</Link></li>
            <li><Link to="/track-order">Track Your Order</Link></li>
            <li><Link to="/subscription">Subscription</Link></li>
            <li><Link to="/royal-rewards">Royal Rewards</Link></li>
            <li><Link to="/concierge">Beauty Concierge</Link></li>
            <li><Link to="/refer">Refer a Friend</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
