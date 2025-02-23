// src/pages/Admin/ManageArticles.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "", image: null });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleAddArticle = async () => {
    const formData = new FormData();
    formData.append("title", newArticle.title);
    formData.append("content", newArticle.content);
    formData.append("image", newArticle.image);

    try {
      await axiosInstance.post("/api/admin/articles", formData);
      alert("Article added successfully!");
      setNewArticle({ title: "", content: "", image: null });
    } catch (error) {
      console.error("Error adding article:", error);
      alert("Failed to add article.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Article Management</h2>

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
        <input type="file" onChange={(e) => setNewArticle({ ...newArticle, image: e.target.files[0] })} />
        <button onClick={handleAddArticle}>Add Article</button>
      </div>

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
                <button onClick={() => alert("Edit Coming Soon!")}>Edit</button>
                <button onClick={() => alert("Delete Coming Soon!")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
