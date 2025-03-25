import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "", image: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchArticles = async () => {
    try {
      const res = await axiosInstance.get("/admin/articles");
      setArticles(res.data);
    } catch (err) {
      setError("❌ Failed to load articles.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.content) {
      setMessage("⚠️ Title and content are required!");
      return;
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
      console.error("❌ Error adding article:", err);
      setError("Failed to add article.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("🛑 Delete this article?")) return;
    try {
      await axiosInstance.delete(`/admin/articles/${id}`);
      setMessage("🗑️ Article deleted.");
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      setError("❌ Failed to delete.");
    }
  };

  return (
    <div className="admin-section">
      <h2>📝 Article Management</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* ✅ New Article Form */}
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
            style={{ width: 100, marginTop: 10 }}
          />
        )}
        <button onClick={handleAddArticle} className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "➕ Add Article"}
        </button>
      </div>

      {/* ✅ List */}
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
                      src={`http://localhost:5000/uploads/articles/${article.imageUrl}`}
                      alt="thumb"
                      style={{ width: 60, borderRadius: 4 }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <button className="btn btn-warning" onClick={() => alert("✏️ Edit Coming Soon!")}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteArticle(article._id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">🚨 No articles available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
