import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-heading">Shop</h3>
          <ul className="footer-list">
            <li>tender lip nectar</li>
            <li><em>inbalance</em></li>
            <li>in my defence</li>
            <li>hustle</li>
            <li>good grease</li>
            <li>eyes & shine</li>
            <li><em>unkissed</em></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Learn</h3>
          <ul className="footer-list">
            <li>About Us</li>
            <li>Geek Lab</li>
            <li>Press</li>
            <li>Blog</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Support</h3>
          <p>Drop us a note :</p>
          <p className="footer-email"><strong>support@dyou.co</strong></p>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Quick links</h3>
          <ul className="footer-list">
            <li>Store Locator</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Order & Shipping Policy</li>
          </ul>
        </div>
      </div>

      <div className="footer-social">
        <button className="social-icon"><FaFacebookF /></button>
        <button className="social-icon"><FaInstagram /></button>
        <button className="social-icon"><FaLinkedinIn /></button>
      </div>
    </footer>
  );
};

export default Footer;
