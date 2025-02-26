// client/src/pages/Contact/Contact.js
import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required.");
      return;
    }

    try {
      // Replace with your backend API endpoint
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setError("");
      } else {
        setError("Failed to send message. Please try again later.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Feel free to reach out with any questions or feedback.</p>

      {isSubmitted && (
        <div className="success-message">
          Thank you for your message! We will get back to you soon.
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
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
        ></textarea>
        <button type="submit" className="contact-submit-btn">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
