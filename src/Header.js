import React, { useState } from "react";
import { useSelector } from "react-redux"; // 🧠 Get state from Redux
import { Link } from "react-router-dom";
import logo from "./assets/Asset8.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBars,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";

function Header() {
  // 🔄 Calculate total quantity from all cart items
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="header-section">
        <div className="header-container">
          {/* Hamburger menu */}
          <div className="menu-icon" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </div>

          {/* Logo */}
          <div className="logo-container">
            <Link to="/">
              <img src={logo} alt="logo" className="logo" />
            </Link>
          </div>

          {/* Search bar */}
          {/* <div className="search-container"> */}
            {/* <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
            {/* <FontAwesomeIcon icon={faSearch} className="search-icon" /> */}
          {/* </div> */}

          {/* Cart */}
          <div className="cart-container">
            <Link to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide-in menu */}
      <div className={`slide-menu ${menuOpen ? "open" : ""}`}>
        <div className="slide-menu-header">
          <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={toggleMenu} />
        </div>
        <Navbar />
      </div>

      {/* Optional overlay */}
      {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </>
  );
}

export default Header;
