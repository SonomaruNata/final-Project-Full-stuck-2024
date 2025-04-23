import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { getFullImageUrl } from "../../utils/imageUtils";
import "./AdminDashboard.css";

const fallbackImage = "/uploads/images/products/default.jpg";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [preview, setPreview] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/admin/products");
      const formatted = data.map((p) => ({
        ...p,
        imageUrl: getFullImageUrl(p.imageUrl, fallbackImage),
      }));
      setProducts(formatted);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError("❌ Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("🛑 Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      setFeedback("🗑️ Product deleted.");
    } catch (err) {
      console.error("❌ Delete Error:", err);
      setError("❌ Error deleting product.");
    }
  };

  const handleAddProduct = async () => {
    setError("");
    setFeedback("");

    const { name, price, stock, description, category, image } = newProduct;

    if (!name.trim() || !price || !stock || !description.trim() || !category.trim()) {
      return setError("⚠️ All fields are required.");
    }

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, val]) => {
      if (val !== null) formData.append(key, val);
    });

    try {
      await axiosInstance.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback("✅ Product added successfully!");
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        category: "",
        image: null,
      });
      setPreview(null);
      fetchProducts();
    } catch (err) {
      console.error("❌ Add Error:", err);
      setError("❌ Failed to add product.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return setError("⚠️ Only image files are allowed.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return setError("⚠️ Max file size is 5MB.");
    }

    setNewProduct((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="admin-section">
      <h2>🛍️ Product Management</h2>

      <div className="add-product-form">
        <h3>Add New Product</h3>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Product Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}

        <button className="btn btn-primary" onClick={handleAddProduct} disabled={loading}>
          {loading ? "Adding..." : "➕ Add Product"}
        </button>

        {feedback && <p className="success-message">{feedback}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <hr />

      {loading ? (
        <p>⏳ Loading products...</p>
      ) : products.length === 0 ? (
        <p>🚨 No products available.</p>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>🖼️ Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(({ _id, name, price, stock, imageUrl }) => (
              <tr key={_id}>
                <td>
                  <img
                    src={imageUrl}
                    alt={name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </td>
                <td>{name}</td>
                <td>${parseFloat(price).toFixed(2)}</td>
                <td>{stock}</td>
                <td>
                  <button className="edit-btn" disabled title="Edit coming soon">
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(_id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProducts;
