import React from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../utils/imageUtils"; // ✅ new import
import "./Article.css";

const Article = ({ article }) => {
  const imageUrl = getFullImageUrl(article.imageUrl, "/uploads/images/articles/default.jpg");

  return (
    <div className="article-card">
      <div className="article-image-wrapper">
        <img
          src={imageUrl}
          alt={article.title}
          className="article-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getFullImageUrl(null, "/uploads/images/articles/default.jpg");
          }}
        />
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-snippet">{article.content?.substring(0, 150)}...</p>
        <p className="article-author">By: {article.author?.name || "Unknown"}</p>
        <Link to={`${article._id}`} className="read-more">Read More →</Link>
      </div>
    </div>
  );
};

export default Article;
