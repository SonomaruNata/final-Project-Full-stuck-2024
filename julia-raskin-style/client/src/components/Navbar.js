import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Fixed Import
import JuliaImages from "../assets/images/about/JuliaImages";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // ✅ Using `logout` from AuthContext
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // ✅ Handle Logout
  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top custom-navbar">
      <div className="container">
        {/* ✅ Brand Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={JuliaImages.brandLogo}
            alt="Julia Raskin Style Logo"
            className="img-fluid rounded-circle brand-logo"
          />
          Julia Raskin Style
        </Link>

        {/* ✅ Mobile Navbar Toggle */}
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

        {/* ✅ Navbar Links */}
        <div className={`collapse navbar-collapse ${isNavCollapsed ? "" : "show"}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* 🌍 Public Links */}
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

            {/* 🔐 Admin Links */}
            {user?.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}

            {/* 👤 User Dashboard */}
            {user && user.role !== "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/user/dashboard">User Dashboard</Link>
              </li>
            )}

            {/* 🔑 Authentication Links */}
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
                <button className="nav-link btn btn-danger" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
