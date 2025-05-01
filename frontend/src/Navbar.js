// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";

// function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user); // Convert to boolean
//   }, []);

//   return (
//     <div className="navbar-section">
//       <div className="navbar-container">
//         <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>
//           Shop Now
//         </NavLink>
//         <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
//           About Us
//         </NavLink>
//         <NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "")}>
//           Blog
//         </NavLink>

//         {!isLoggedIn && (
//           <>
//             <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
//               Login
//             </NavLink>
//             <NavLink to="/signup" className={({ isActive }) => (isActive ? "active" : "")}>
//               Signup
//             </NavLink>
//             <NavLink to="/forget-password" className={({ isActive }) => (isActive ? "active" : "")}>
//               Forget Password
//             </NavLink>
//           </>
//         )}

//         {isLoggedIn && (
//           <NavLink to="/account" className={({ isActive }) => (isActive ? "active" : "")}>
//             My Account
//           </NavLink>
//         )}

//         <NavLink to="/adminpanel" className={({ isActive }) => (isActive ? "active" : "")}>
//           AdminPanel
//         </NavLink>
//       </div>
//     </div>
//   );
// }

// export default Navbar;

// Navbar.js
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // ✅ Adjust the path if needed

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the context's logout method
    localStorage.removeItem("user"); // Optional: clear user data
    navigate("/login");
  };

  return (
    <div className="navbar-section">
      <div className="navbar-container">
        <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>
          Shop Now
        </NavLink>
        <NavLink to="/aboutUs" className={({ isActive }) => (isActive ? "active" : "")}>
          About Us
        </NavLink>
        <NavLink to="/blogs" className={({ isActive }) => (isActive ? "active" : "")}>
          Blog
        </NavLink>

        {!isLoggedIn && (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? "active" : "")}>
              Signup
            </NavLink>
            <NavLink to="/forget-password" className={({ isActive }) => (isActive ? "active" : "")}>
              Forget Password
            </NavLink>
          </>
        )}

        {isLoggedIn && (
          <>
            <NavLink to="/account" className={({ isActive }) => (isActive ? "active" : "")}>
              My Account
            </NavLink>
            <NavLink to="/order-details" className={({ isActive }) => (isActive ? "active" : "")}>
              Order Details
            </NavLink>
            <NavLink to="/track-order" className={({ isActive }) => (isActive ? "active" : "")}>
            Track Your Order
            </NavLink>
            <NavLink
              onClick={handleLogout}
              style={{ marginLeft: '0px', cursor: 'pointer', color: 'red' }}
            >
              Logout
            </NavLink>
          </>
        )}
        <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
        Contact Us
        </NavLink>

        <NavLink to="/adminpanel" className={({ isActive }) => (isActive ? "active" : "")}>
          AdminPanel
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;

