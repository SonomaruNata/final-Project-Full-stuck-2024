import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/products/default.jpg";

const getImageUrl = (path) =>
  path?.startsWith("http") ? path : `${API_URL}/${path || fallbackImage}`;

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (localStorage.getItem("token")) {
          const res = await axios.get(`${API_URL}/api/cart`, {
            withCredentials: true,
          });
          setCartItems(res.data.items || []);
        } else {
          const local = JSON.parse(localStorage.getItem("cart")) || [];
          setCartItems(local);
        }
      } catch (err) {
        console.error("❌ Cart load failed:", err);
        setError("⚠️ Failed to load cart. Please refresh.");
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) =>
        sum + (item.product?.price || item.price || 0) * (item.quantity || 1),
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `${API_URL}/api/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("❌ Quantity update failed:", err);
      alert("❌ Failed to update quantity.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${productId}`, {
        withCredentials: true,
      });
      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      console.error("❌ Remove failed:", err);
      alert("❌ Failed to remove item.");
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛍️ Your Stylish Cart</h2>

      {error && <p className="error-message">{error}</p>}

      {cartItems.length > 0 ? (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>🖼️ Product</th>
                <th>💵 Price</th>
                <th>🔢 Quantity</th>
                <th>💰 Subtotal</th>
                <th>🗑️</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const product = item.product || item;
                const imageUrl = getImageUrl(product.imageUrl);

                return (
                  <tr key={product._id}>
                    <td className="cart-product">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="cart-product-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImage;
                        }}
                      />
                      <span>{product.name}</span>
                    </td>
                    <td>${product.price?.toFixed(2)}</td>
                    <td>
                      <button
                        className="cart-btn"
                        onClick={() =>
                          updateQuantity(product._id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                      <button
                        className="cart-btn"
                        onClick={() =>
                          updateQuantity(product._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </td>
                    <td>${(product.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="cart-delete-btn"
                        onClick={() => removeItem(product._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="cart-summary">
            <p>🧾 Total: <strong>${total.toFixed(2)}</strong></p>
            <Link to="/order" className="cart-checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      ) : (
        <p className="empty-cart-message">🛒 Your cart is currently empty.</p>
      )}
    </div>
  );
}

export default Cart;
