import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/articles/default.jpg";

const getFullImageUrl = (path) =>
  path?.startsWith("http") ? path : `${API_URL}${path || fallbackImage}`;

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    published: false,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    const { title, content, category, tags, published, image } = newArticle;
    if (!title.trim() || !content.trim()) {
      return setError("⚠️ Title and content are required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("published", published);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await axiosInstance.post("/admin/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Article added successfully!");
      setNewArticle({
        title: "",
        content: "",
        category: "",
        tags: "",
        published: false,
        image: null,
      });
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
    if (!file.type.startsWith("image/")) return setError("⚠️ Only image files allowed.");
    if (file.size > 5 * 1024 * 1024) return setError("⚠️ Max file size is 5MB.");
    setNewArticle((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="admin-section">
      <h2>📝 Manage Articles</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="add-article-form">
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
          type="text"
          placeholder="Category (optional)"
          value={newArticle.category}
          onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={newArticle.tags}
          onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newArticle.published}
            onChange={(e) => setNewArticle({ ...newArticle, published: e.target.checked })}
          />{" "}
          Publish
        </label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}
        <button className="btn btn-primary" onClick={handleAddArticle} disabled={loading}>
          {loading ? "Submitting..." : "➕ Add Article"}
        </button>
      </div>

      <hr />

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
