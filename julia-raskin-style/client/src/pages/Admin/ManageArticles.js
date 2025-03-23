import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "", image: null });
  const [error, setError] = useState("");

  // ✅ Fetch Articles Function
  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get("/admin/articles"); // ✅ Fixed API path
      setArticles(response.data);
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
      setError("Failed to load articles. Please try again.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ✅ Add New Article
  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.content) {
      alert("⚠️ Title and content are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newArticle.title);
    formData.append("content", newArticle.content);
    if (newArticle.image) {
      formData.append("image", newArticle.image);
    }

    try {
      await axiosInstance.post("/admin/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Article added successfully!");
      setNewArticle({ title: "", content: "", image: null });

      fetchArticles(); // ✅ Refresh articles after adding
    } catch (error) {
      console.error("❌ Error adding article:", error);
      setError("Failed to add article. Please try again.");
    }
  };

  // ✅ Handle Delete Article
  const handleDeleteArticle = async (id) => {
    if (!window.confirm("🛑 Are you sure you want to delete this article?")) return;

    try {
      await axiosInstance.delete(`/api/admin/articles/${id}`);
      alert("🗑️ Article deleted successfully!");
      fetchArticles(); // ✅ Refresh list after deletion
    } catch (error) {
      console.error("❌ Error deleting article:", error);
      setError("Failed to delete article.");
    }
  };

  return (
    <div className="admin-section">
      <h2>📝 Article Management</h2>

      {error && <p className="error-message">{error}</p>}

      {/* ✅ Add New Article Form */}
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
        <input type="file" accept="image/*" onChange={(e) => setNewArticle({ ...newArticle, image: e.target.files[0] })} />
        <button onClick={handleAddArticle} className="btn btn-primary">➕ Add Article</button>
      </div>

      {/* ✅ Articles Table */}
      <table className="modern-table">
        <thead>
          <tr>
            <th>📰 Title</th>
            <th>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => alert("✏️ Edit Coming Soon!")}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteArticle(article._id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="2">🚨 No articles available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
