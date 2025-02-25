import React from "react";
import { Link } from "react-router-dom";
import "./Article.css";

const Article = ({ article }) => {
  return (
    <div className="article-card">
      <div className="article-image-wrapper">
        <img
          src={`http://localhost:5000/images/articles/${article.imageUrl}`}
          alt={article.title}
          className="article-image"
        />
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-snippet">{article.content.substring(0, 150)}...</p>
        <p className="article-author">By: {article.author?.name || "Unknown"}</p>
        <Link to={`/articles/${article._id}`} className="read-more">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default Article;
