import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductItem.css";

const ProductItem = ({ product, handleEditProduct, handleDeleteProduct }) => {
  const navigate = useNavigate();

  // ✅ Function to add to cart
  const addToCart = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );
      alert("🛒 Product added to cart!");
      navigate("/cart"); // ✅ Redirect to cart page
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="product-item">
      <img
        src={`http://localhost:5000${product.imageUrl}`}
        alt={product.name}
        className="product-image"
      />
      <h4>{product.name}</h4>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Stock: {product.stock}</p>
      <div className="product-actions">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleEditProduct(product)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteProduct(product._id)}
        >
          Delete
        </button>
        <button className="add-to-cart-btn" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
