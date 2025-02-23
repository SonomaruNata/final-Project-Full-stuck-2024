// src/pages/Admin/ManageProducts.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ Fetch Products on Component Load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Add New Product
  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("quantity", newProduct.quantity);
    formData.append("description", newProduct.description);
    formData.append("image", newProduct.image);

    try {
      await axiosInstance.post("/api/admin/products", formData);
      alert("Product added successfully!");
      setNewProduct({ name: "", price: "", quantity: "", description: "", image: null });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  // ✅ Update Existing Product
  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("price", editingProduct.price);
    formData.append("quantity", editingProduct.quantity);
    formData.append("description", editingProduct.description);

    if (editingProduct.image) {
      formData.append("image", editingProduct.image);
    }

    try {
      await axiosInstance.put(`/api/admin/products/${editingProduct._id}`, formData);
      alert("Product updated successfully!");
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  // ✅ Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Products</h2>

      {/* ✅ Add Product Form */}
      <div className="add-product">
        <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={editingProduct ? editingProduct.name : newProduct.name}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, name: e.target.value })
              : setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          value={editingProduct ? editingProduct.price : newProduct.price}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, price: e.target.value })
              : setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Quantity"
          value={editingProduct ? editingProduct.quantity : newProduct.quantity}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, quantity: e.target.value })
              : setNewProduct({ ...newProduct, quantity: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          value={editingProduct ? editingProduct.description : newProduct.description}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, description: e.target.value })
              : setNewProduct({ ...newProduct, description: e.target.value })
          }
        ></textarea>
        <input
          type="file"
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, image: e.target.files[0] })
              : setNewProduct({ ...newProduct, image: e.target.files[0] })
          }
        />
        <button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
        {editingProduct && (
          <button onClick={() => setEditingProduct(null)}>Cancel Edit</button>
        )}
      </div>

      {/* ✅ Product Table */}
      <table className="modern-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
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
              <td>{product.quantity}</td>
              <td>{product.description}</td>
              <td>
                <button onClick={() => setEditingProduct(product)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
