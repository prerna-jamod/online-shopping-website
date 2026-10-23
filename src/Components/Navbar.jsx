import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Get wishlist items from Redux
  const wishlist = useSelector((state) => state.wishlist?.items || []);

  const wishlistCount = wishlist.length;

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="page-container">
      <div className="navbar-container">
        {/* ================= LOGO ================= */}
        <div className="logo-box">
          <NavLink to="/" onClick={closeMenu}>
            <div className="nav-logo-text">FASCO</div>
          </NavLink>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* ================= NAVIGATION ================= */}
        <div className={`nav-box ${isOpen ? "nav-open" : ""}`}>
          {/* Home */}
          <div className="nav-home">
            <NavLink to="/" end onClick={closeMenu}>
              Home
            </NavLink>
          </div>

          {/* Deals */}
          <div className="nav-deals">
            <NavLink to="/Deals" onClick={closeMenu}>
              Deals
            </NavLink>
          </div>

          {/* New Arrivals */}
          <div className="nav-New">
            <NavLink to="/NewArrivals" onClick={closeMenu}>
              New Arrivals
            </NavLink>
          </div>

          {/* Packages */}
          <div className="nav-Packages">
            <NavLink to="/Packages" onClick={closeMenu}>
              Packages
            </NavLink>
          </div>

          {/* Sign In */}
          <div className="nav-Signin">
            <NavLink to="/Signin" onClick={closeMenu}>
              Sign in
            </NavLink>
          </div>

          {/* Sign Up */}
          <div className="button-box">
            <button className="button">
              <NavLink to="/SignUp" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </button>
          </div>

          {/* ================= WISHLIST ================= */}
          <div className="Wishlist-box">
            <NavLink
              to="/wishlist"
              onClick={closeMenu}
              className="wishlist-link"
            >
              <span>Wishlist</span>

              {wishlistCount > 0 && (
                <span className="wishlist-count">{wishlistCount}</span>
              )}
            </NavLink>
          </div>

          {/* ================= CART ================= */}
          <div className="Cart-box">
            <button className="Cart-btn">
              <NavLink to="/cart" onClick={closeMenu}>
                Cart
              </NavLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
