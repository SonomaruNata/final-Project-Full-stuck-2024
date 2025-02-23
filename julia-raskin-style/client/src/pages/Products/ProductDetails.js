import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ For navigation
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  // ✅ Wrap fetchProduct with useCallback
  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError("Failed to load product.");
    }
  }, [id]); // ✅ Dependency array to prevent infinite loop

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ✅ Add to Cart Function
  const addToCart = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: id, quantity: 1 }, // Send product ID and quantity
        { withCredentials: true } // Include cookies for authentication
      );
      alert("🛒 Product added to cart!");
      navigate("/cart"); // ✅ Redirect to cart page
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="product-details-container">
      {error ? (
        <p>{error}</p>
      ) : product ? (
        <div className="product-details-card">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{ 
                width: "100%", 
                maxWidth: "400px", 
                height: "auto", 
                aspectRatio: "1/1", 
                objectFit: "cover", 
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
              }} 
            />
          </div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>${product.price}</h3>
          {/* ✅ Add to Cart Button */}
          <button onClick={addToCart} className="add-to-cart-btn">
            Add to Cart 🛒
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProductDetails;
