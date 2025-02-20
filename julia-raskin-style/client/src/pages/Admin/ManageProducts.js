import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/products");
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      alert("✅ Product deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="manage-section">
      <h2>Manage Products</h2>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button className="edit-btn" onClick={() => alert("Edit Product Coming Soon!")}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
