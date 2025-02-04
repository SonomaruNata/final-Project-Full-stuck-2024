import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./ShoppingSchool.css";

const ShoppingSchool = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axiosInstance.get("/api/articles"); // ✅ Fetch from backend
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="shopping-school-container">
      <h1>Welcome to <span style={{ color: "#e91e63" }}>Shopping School</span></h1>
      <p>
        Learn the art of shopping like a pro! Whether you're mastering the latest fashion trends
        or hunting for the best deals, our school will guide you every step of the way.
      </p>

      <div className="articles-section">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article._id} className="article-card">
              <img
                src={`http://localhost:5000${article.imageUrl}`} // ✅ Main Article Image
                alt={article.title}
                className="article-image"
              />
              <h3>{article.title}</h3>
              <p>{article.content.substring(0, 150)}...</p>
              <p className="author">By: {article.author?.name || "Unknown"}</p>

              {/* ✅ Display Gallery if Available */}
              {article.gallery?.length > 0 && (
                <div className="article-gallery">
                  {article.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${image}`} // ✅ Gallery Images
                      alt={`Gallery ${index + 1}`}
                      className="gallery-image"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No fashion articles found.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingSchool;
