import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart", { withCredentials: true });
      setCartItems(response.data);
    } catch (err) {
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add or update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/${productId}`, { quantity }, { withCredentials: true });
      fetchCart();
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, { withCredentials: true });
      fetchCart();
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  // ✅ Checkout cart
  const checkout = async () => {
    try {
      await axios.post("http://localhost:5000/api/cart/checkout", {}, { withCredentials: true });
      alert("🎉 Checkout successful!");
      fetchCart();
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛍️ Your Stylish Cart</h2>
      {loading ? (
        <p>Loading your cart...</p>
      ) : error ? (
        <p className="cart-error">{error}</p>
      ) : cartItems.length > 0 ? (
        <div className="cart-content">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td className="cart-product">
                    <img src={item.product.imageUrl} alt={item.product.name} />
                    <span>{item.product.name}</span>
                  </td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td className="cart-quantity">
                    <button className="cart-btn" onClick={() => updateCartItem(item.product._id, item.quantity - 1)}>-</button>
                    {item.quantity}
                    <button className="cart-btn" onClick={() => updateCartItem(item.product._id, item.quantity + 1)}>+</button>
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="cart-delete-btn" onClick={() => removeFromCart(item.product._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h4>Total: $ {cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</h4>
            <button className="cart-checkout-btn" onClick={checkout}>Proceed to Checkout</button>
          </div>
        </div>
      ) : (
        <p>Your Cart is Empty 🛒</p>
      )}
    </div>
  );
}

export default Cart;


