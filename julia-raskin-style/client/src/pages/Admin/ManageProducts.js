import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/admin/products");
      setProducts(response.data);
    } catch (err) {
      setError("❌ Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axiosInstance.delete(`/admin/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      alert("❌ Error deleting product.");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      return alert("⚠️ Name, price, and stock are required fields.");
    }

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axiosInstance.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product added successfully!");
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
      alert("❌ Failed to add product.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
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
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        ></textarea>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}

        <button className="btn btn-primary" onClick={handleAddProduct}>
          ➕ Add Product
        </button>
      </div>

      {loading ? (
        <p>⏳ Loading products...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                </td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>
                    Delete
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
