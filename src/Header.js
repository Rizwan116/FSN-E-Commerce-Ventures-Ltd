// import React, { useState } from "react";
import logo from "./assets/logos.png"; // Import local image
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

function Header() {
  // const [cartCount, setCartCount] = useState(1); // Dynamic count

  return (
    <div className="header-section">
      <div className="header-container">

      <div className="empty-container">
          {/* <span>.</span> */}
        </div>
        {/* Logo Section */}
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>

        {/* Cart Section */}
        {/* <div className="cart-container">
          <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div> */}
      </div>
    </div>
  );
}

export default Header;
