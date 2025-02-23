// client/src/pages/ShoppingSchool/ShoppingSchool.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import Article from "../../components/Article";
import "./ShoppingSchool.css";

const ShoppingSchool = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axiosInstance.get("/api/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="shopping-school-container">
      <h1>
        Welcome to <span style={{ color: "#e91e63" }}>Shopping School</span>
      </h1>
      <p>
        Learn the art of shopping like a pro! Whether you're mastering the latest fashion trends
        or hunting for the best deals, our school will guide you every step of the way.
      </p>

      <div className="articles-section">
        {articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map((article) => (
              <Article key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p>No fashion articles found.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingSchool;
