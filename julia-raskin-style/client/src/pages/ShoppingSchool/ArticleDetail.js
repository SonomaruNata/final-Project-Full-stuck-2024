// client/src/pages/ShoppingSchool/ArticleDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import "./ArticleDetail.css";

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
        setError("❌ Failed to load article. Please try again.");
        console.error("❌ Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>⏳ Loading article...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="article-detail-container">
      <h1 className="article-title">{article.title}</h1>

      {/* ✅ Main Image */}
      <img
        src={`http://localhost:5000${article.imageUrl}`}  // ✅ Corrected URL
        alt={article.title}
        className="article-detail-image"
      />

      {/* ✅ Article Content */}
      <div className="article-content">
        <p>{article.content}</p>
      </div>

      {/* ✅ Gallery Section */}
      {article.gallery?.length > 0 && (
        <div className="article-detail-gallery">
          <h2 className="gallery-title">Gallery</h2>
          <div className="gallery-images">
            {article.gallery.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000${image}`}  // ✅ Corrected URL
                alt={`Gallery ${index + 1}`}
                className="gallery-image"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
