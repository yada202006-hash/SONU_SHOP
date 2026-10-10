import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2026 ShopNest. All rights reserved</p>
        <ul className="footer-links">
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/disclaimer">Disclaimer</Link></li>
          <li><Link to="/privacy">Return Policy</Link></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
