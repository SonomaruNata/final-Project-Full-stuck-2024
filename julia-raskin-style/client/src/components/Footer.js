import React, { useState } from "react";
import axios from "axios";
import "./Footer.css";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      setResponseMessage("✅ Thank you for contacting us!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setResponseMessage("❌ Something went wrong. Please try again later.");
      console.error("Contact form error:", error.message);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* ✅ Social Media Icons */}
        <div className="footer-social">
          <a href="https://www.facebook.com/ulia.raskina.2025" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/stories/raskina.yulia/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://t.me/JuliaRaskinStyleon" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-telegram-plane"></i>
          </a>
        </div>

        {/* ✅ Contact Form */}
        <form className="footer-contact-form" onSubmit={handleSubmit}>
          <h4>Contact Me</h4>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send</button>
          {responseMessage && <p className="response-message">{responseMessage}</p>}
        </form>

        {/* ✅ Info */}
        <div className="footer-info">
          <p>📍 Address: Ashkelon, Israel</p>
          <p>© 2025 Create by Natalia UnicLeibo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
