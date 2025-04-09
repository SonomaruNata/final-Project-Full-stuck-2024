import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import "./ArticleDetail.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/articles/default.jpg";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axiosInstance.get(`/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error("❌ Error fetching article:", err);
        setError("❌ Failed to load article. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>⏳ Loading article...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!article) return <p>🚫 Article not found.</p>;

  return (
    <div className="article-detail-container">
      <h1 className="article-title">{article.title}</h1>

      {/* ✅ Main Image */}
      <img
        src={article.imageUrl || fallbackImage}
        alt={article.title}
        className="article-detail-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />

      {/* ✅ Article Content */}
      <div className="article-content">
        <p>{article.content}</p>
      </div>

      {/* ✅ Gallery Section */}
      {article.gallery?.length > 0 && (
        <div className="article-detail-gallery">
          <h2 className="gallery-title">🖼️ Gallery</h2>
          <div className="gallery-images">
            {article.gallery.map((img, index) => (
              <img
                key={index}
                src={img || fallbackImage}
                alt={`Gallery ${index + 1}`}
                className="gallery-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
