// Navbar.js
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar-section">
      <div className="navbar-container">
        <NavLink to="/shop" className={({ isActive }) => isActive ? "active" : ""}>Shop Now</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? "active" : ""}>Blog</NavLink>
      </div>
    </div>
  );
}

export default Navbar;
