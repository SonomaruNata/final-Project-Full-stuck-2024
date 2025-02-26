import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OrderPage.css";

function OrderPage() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          withCredentials: true,
        });
        setCartItems(response.data);
      } catch (err) {
        setError("Failed to load cart items.");
      }
    };
    fetchCart();
  }, []);

  const placeOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {},
        { withCredentials: true }
      );
      alert("🎉 Order placed successfully!");
      navigate("/user-dashboard");
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="order-container">
      <h2 className="order-title">🧾 Order Summary</h2>
      {cartItems.length > 0 ? (
        <div className="order-items">
          {cartItems.map((item) => (
            <div key={item.product._id} className="order-item">
              <h3>{item.product.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.product.price.toFixed(2)}</p>
            </div>
          ))}
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      ) : (
        <p>Your Cart is Empty 🛒</p>
      )}
    </div>
  );
}

export default OrderPage;
