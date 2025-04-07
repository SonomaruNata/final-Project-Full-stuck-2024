import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import Article from "../../components/Article";
import JuliaImages from "../../assets/images/about/JuliaImages";
import { getFullImageUrl } from "../../utils/imageUtils";
import "./ShoppingSchool.css";

const ShoppingSchool = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axiosInstance.get("/articles");

        const formatted = data.map((article) => ({
          ...article,
          imageUrl: getFullImageUrl(article.imageUrl, "/uploads/images/articles/default.jpg"),
          gallery: Array.isArray(article.gallery)
            ? article.gallery.map((img) =>
                getFullImageUrl(img, "/uploads/images/articles/default.jpg")
              )
            : [],
        }));

        setArticles(formatted);
      } catch (err) {
        console.error("❌ Error fetching articles:", err);
        setError("⚠️ Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="shopping-school-container">
      {/* 🎨 Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(
            rgba(238, 174, 202, 0.7),
            rgba(148, 187, 233, 0.7)
          ), url(${JuliaImages.shoppingHero})`,
        }}
      >
        <h1>
          Welcome to <span style={{ color: "#e91e63" }}>Shopping School</span>
        </h1>
        <p>
          Learn the art of shopping like a pro! Whether you're mastering the latest fashion trends
          or hunting for the best deals, our school will guide you every step of the way.
        </p>
      </div>

      {/* 📰 Articles Section */}
      <div className="articles-section">
        {loading ? (
          <p className="loading-text">⏳ Loading articles...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map((article) => (
              <Article key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p className="empty-text">🚫 No fashion articles found.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingSchool;
