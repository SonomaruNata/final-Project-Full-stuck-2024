import React, { useState, useEffect } from 'react';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', content: '' });
  const [editArticle, setEditArticle] = useState(null);

  // Fetch articles from the backend
  useEffect(() => {
    fetch('/api/admin/articles')
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error('Error fetching articles:', err));
  }, []);

  // Add a new article
  const handleAddArticle = () => {
    fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle),
    })
      .then((response) => response.json())
      .then((article) => {
        setArticles([...articles, article]);
        setNewArticle({ title: '', content: '' });
      })
      .catch((err) => console.error('Error adding article:', err));
  };

  // Update an article
  const handleUpdateArticle = () => {
    fetch(`/api/admin/articles/${editArticle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editArticle),
    })
      .then((response) => response.json())
      .then((updatedArticle) => {
        setArticles(
          articles.map((article) =>
            article.id === updatedArticle.id ? updatedArticle : article
          )
        );
        setEditArticle(null);
      })
      .catch((err) => console.error('Error updating article:', err));
  };

  // Delete an article
  const handleDeleteArticle = (id) => {
    fetch(`/api/routs/articles/${id}`, { method: 'DELETE' })
      .then(() => setArticles(articles.filter((article) => article.id !== id)))
      .catch((err) => console.error('Error deleting article:', err));
  };

  return (
    <div className="manage-articles">
      <h1>Manage Articles</h1>

      {/* Add Article */}
      <div className="add-article">
        <h2>{editArticle ? 'Edit Article' : 'Add New Article'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={editArticle ? editArticle.title : newArticle.title}
          onChange={(e) =>
            editArticle
              ? setEditArticle({ ...editArticle, title: e.target.value })
              : setNewArticle({ ...newArticle, title: e.target.value })
          }
        />
        <textarea
          placeholder="Content"
          value={editArticle ? editArticle.content : newArticle.content}
          onChange={(e) =>
            editArticle
              ? setEditArticle({ ...editArticle, content: e.target.value })
              : setNewArticle({ ...newArticle, content: e.target.value })
          }
        ></textarea>
        <button onClick={editArticle ? handleUpdateArticle : handleAddArticle}>
          {editArticle ? 'Update Article' : 'Add Article'}
        </button>
        {editArticle && (
          <button onClick={() => setEditArticle(null)}>Cancel Edit</button>
        )}
      </div>

      {/* Articles List */}
      <h2>Articles</h2>
      <ul className="articles-list">
        {articles.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <button onClick={() => setEditArticle(article)}>Edit</button>
            <button onClick={() => handleDeleteArticle(article.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageArticles;
