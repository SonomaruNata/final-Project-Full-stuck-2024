// src/components/Navbar.js
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import JuliaImages from "../assets/images/about/JuliaImages";
import "./Navbar.css";

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const logout = () => {
    handleLogout();
    navigate("/login");  // Redirect to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src={JuliaImages.brandLogo}
            alt="Julia Raskin Style Logo"
            className="img-fluid rounded-circle brand-logo"
          />
          Julia Raskin Style
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isNavCollapsed ? "" : "show"}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {/* ✅ Public Links */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About Me</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shopping-school">Shopping School</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">Shop</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>

            {/* ✅ Admin Links */}
            {user?.isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}

            {/* ✅ User Links */}
            {user && !user.isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/user/dashboard">User Dashboard</Link>
              </li>
            )}

            {/* ✅ Auth Links */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-danger" onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
