import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/articles/default.jpg";

// 🔧 Utility for formatting image URLs
const getFullImageUrl = (path) =>
  path?.startsWith("http") ? path : `${API_URL}${path || fallbackImage}`;

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔄 Fetch articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axiosInstance.get("/admin/articles");
      const formatted = res.data.map((a) => ({
        ...a,
        imageUrl: getFullImageUrl(a.imageUrl),
      }));
      setArticles(formatted);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError("❌ Failed to load articles.");
    }
  };

  const handleAddArticle = async () => {
    setMessage("");
    setError("");

    const { title, content, image } = newArticle;

    if (!title.trim() || !content.trim()) {
      return setError("⚠️ Title and content are required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await axiosInstance.post("/admin/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Article added successfully!");
      setNewArticle({ title: "", content: "", image: null });
      setPreview(null);
      fetchArticles();
    } catch (err) {
      console.error("❌ Add Error:", err);
      setError("❌ Failed to add article.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this article?")) return;
    try {
      await axiosInstance.delete(`/admin/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
      setMessage("🗑️ Article deleted.");
    } catch (err) {
      console.error("❌ Delete Error:", err);
      setError("❌ Failed to delete article.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return setError("⚠️ Only image files are allowed.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return setError("⚠️ File size exceeds 5MB limit.");
    }

    setNewArticle((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="admin-section">
      <h2>📝 Manage Articles</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* 🧾 Article Form */}
      <div className="add-article-form">
        <input
          type="text"
          placeholder="Article Title"
          value={newArticle.title}
          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
        />
        <textarea
          placeholder="Write your article content here..."
          value={newArticle.content}
          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}
        <button className="btn btn-primary" onClick={handleAddArticle} disabled={loading}>
          {loading ? "Submitting..." : "➕ Add Article"}
        </button>
      </div>

      <hr />

      {/* 📋 Articles Table */}
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
            articles.map(({ _id, title, imageUrl }) => (
              <tr key={_id}>
                <td>{title}</td>
                <td>
                  <img
                    src={imageUrl}
                    alt={title}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </td>
                <td>
                  <button className="edit-btn" disabled title="Edit coming soon">
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteArticle(_id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">🚨 No articles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
