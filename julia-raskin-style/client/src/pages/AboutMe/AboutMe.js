import React from "react";
import JuliaImages from "../../assets/images/about/JuliaImages";
import "./AboutMe.css";

function AboutMe() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <h1 className="about-title">Meet Julia Raskin</h1>
        <p className="about-subtitle">
          A journey through fashion, creativity, and self-expression.
        </p>
      </section>

      {/* Profile Section */}
      <div className="about-content">
        <div className="about-profile">
          <img
            src={JuliaImages.juliaPortrait}
            alt="Julia Raskin"
            className="about-image"
          />
        </div>
        <div className="about-text">
          <h2>My Journey in Fashion</h2>
          <p>
            Hello! I’m Julia Raskin, a passionate stylist and fashion enthusiast
            with a love for European culture, aesthetics, and creativity. My
            fashion journey began with a desire to blend unique styles from
            different cultures into my own mix of **sophistication, comfort, and individuality**.
          </p>
          <p>
            Having lived in **Madrid**, I was inspired by its timeless elegance and
            bohemian vibes. Now based in **Israel**, I continue to embrace a fusion
            of Mediterranean and international fashion influences, empowering people
            to **discover their unique style and confidence**.
          </p>
        </div>
      </div>

      {/* About Background Section */}
      <div className="about-background">
        <div className="about-overlay">
          <div className="about-brand">
            <img src={JuliaImages.brandLogo} alt="Julia Raskin Style Logo" className="brand-logo" />
            <h3 className="brand-message">
              Fashion is more than clothing—it's a **statement of confidence,** a
              reflection of your unique personality.
            </h3>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="about-footer">
        <h3>Let's Connect!</h3>
        <p>Join me in this journey of style and elegance. Stay inspired!</p>
      </div>
    </div>
  );
}

export default AboutMe;
