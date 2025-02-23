// client/src/components/Article.js
import React from "react";
import "./Article.css";

const Article = ({ article }) => {
  return (
    <div className="article-card">
      <img
        src={`http://localhost:5000${article.imageUrl}`} 
        alt={article.title}
        className="article-image"
      />
      <div className="article-content">
        <h3>{article.title}</h3>
        <p>{article.content.substring(0, 150)}...</p>
        <p className="author">By: {article.author?.name || "Unknown"}</p>
        {article.gallery?.length > 0 && (
          <div className="article-gallery">
            {article.gallery.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000${image}`}
                alt={`Gallery ${index + 1}`}
                className="gallery-image"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Article;
