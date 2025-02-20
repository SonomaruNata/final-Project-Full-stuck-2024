import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);

  // ✅ Fetch Articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("❌ Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // ✅ Delete Article
  const handleDeleteArticle = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/articles/${id}`);
      setArticles(articles.filter((article) => article._id !== id));
      alert("✅ Article deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting article:", error);
      alert("Failed to delete article.");
    }
  };

  return (
    <div className="manage-section">
      <h2>Manage Articles</h2>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td>{article.title}</td>
              <td>
                <button className="edit-btn" onClick={() => alert("Edit Article Coming Soon!")}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteArticle(article._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
