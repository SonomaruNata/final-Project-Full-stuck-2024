import React, { useState, useRef } from "react";
import "./Contact.css";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ submitting: false, submitted: false, error: "" });
  const nameRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    setStatus({ submitting: true, submitted: false, error: "" });

    // ✅ Basic frontend validation
    if (!name.trim() || !email.trim() || !message.trim() || message.length < 10) {
      setStatus({
        submitting: false,
        submitted: false,
        error: "⚠️ Please fill out all fields and enter a valid message (min. 10 characters).",
      });
      return;
    }

    if (!validateEmail(email)) {
      setStatus({
        submitting: false,
        submitted: false,
        error: "⚠️ Please enter a valid email address.",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "❌ Failed to send your message.");
      }

      setStatus({ submitting: false, submitted: true, error: "" });
      setFormData({ name: "", email: "", message: "" });

      // Optional: scroll to top or focus
      nameRef.current?.focus();
    } catch (err) {
      setStatus({ submitting: false, submitted: false, error: err.message });
    }
  };

  return (
    <div className="contact-page" aria-live="polite">
      <h1>📬 Contact Us</h1>
      <p>We’d love to hear from you. Fill out the form and we’ll get back to you soon.</p>

      {status.submitted && <div className="success-message">✅ Message sent successfully!</div>}
      {status.error && <div className="error-message" role="alert">{status.error}</div>}

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Name</label>
        <input
          ref={nameRef}
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={status.submitting}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={status.submitting}
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={status.submitting}
        />

        <button type="submit" className="contact-submit-btn" disabled={status.submitting}>
          {status.submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
