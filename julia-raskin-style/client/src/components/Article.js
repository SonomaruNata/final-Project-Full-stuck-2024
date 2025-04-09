import React from "react";
import { Link } from "react-router-dom";
import "./Article.css";

const fallbackImage = "/uploads/images/articles/default.jpg";

const Article = ({ article }) => {
  return (
    <div className="article-card">
      <div className="article-image-wrapper">
        <img
          src={article.imageUrl || fallbackImage}
          alt={article.title}
          className="article-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
      </div>

      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-snippet">
          {article.content?.substring(0, 150) || "No content available"}...
        </p>
        <p className="article-author">By: {article.author?.name || "Unknown"}</p>
        <Link to={`/shopping-school/${article._id}`} className="read-more">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default Article;
