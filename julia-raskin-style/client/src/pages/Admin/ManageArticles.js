// ✅ Cleaned, debugged, synced with backend image URL updates
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "", image: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchArticles = async () => {
    try {
      const res = await axiosInstance.get("/admin/articles");
      setArticles(res.data);
    } catch {
      setError("❌ Failed to load articles.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async () => {
    setMessage("");
    setError("");

    if (!newArticle.title.trim() || !newArticle.content.trim()) {
      return setMessage("⚠️ Title and content are required!");
    }

    const formData = new FormData();
    formData.append("title", newArticle.title);
    formData.append("content", newArticle.content);
    if (newArticle.image) formData.append("image", newArticle.image);

    try {
      setLoading(true);
      await axiosInstance.post("/admin/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Article added successfully!");
      setNewArticle({ title: "", content: "", image: null });
      fetchArticles();
    } catch (err) {
      console.error("❌ Add Article Error:", err);
      setError("❌ Failed to add article.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("🛑 Are you sure you want to delete this article?")) return;
    try {
      await axiosInstance.delete(`/admin/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
      setMessage("🗑️ Article deleted.");
    } catch (err) {
      console.error("❌ Delete Article Error:", err);
      setError("❌ Failed to delete article.");
    }
  };

  return (
    <div className="admin-section">
      <h2>📝 Article Management</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* ➕ Add Article Form */}
      <div className="add-article">
        <input
          type="text"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newArticle.content}
          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewArticle({ ...newArticle, image: e.target.files[0] })}
        />
        {newArticle.image && (
          <img
            src={URL.createObjectURL(newArticle.image)}
            alt="Preview"
            className="preview-image"
          />
        )}
        <button
          className="btn btn-primary"
          onClick={handleAddArticle}
          disabled={loading}
        >
          {loading ? "Submitting..." : "➕ Add Article"}
        </button>
      </div>

      {/* 📋 Article Table */}
      <table className="modern-table">
        <thead>
          <tr>
            <th>📰 Title</th>
            <th>🖼️ Image</th>
            <th>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt="thumb"
                      className="product-image"
                      style={{ width: 60, borderRadius: 4 }}
                    />
                  ) : "—"}
                </td>
                <td>
                  <button className="edit-btn" disabled title="Edit coming soon!">
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteArticle(article._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">🚨 No articles available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
