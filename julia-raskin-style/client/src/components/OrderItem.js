// src/components/OrderItem.js
import React from "react";
import "./OrderItem.css";

const OrderItem = ({ order, handleUpdateStatus, handleCancelOrder }) => {
  return (
    <div className="order-item">
      <h3>Order #{order._id}</h3>
      <p>Status: <strong>{order.status}</strong></p>
      <ul>
        {order.items.map((item) => (
          <li key={item._id}>
            {item.product.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <div className="order-actions">
        <button
          className="btn btn-sm btn-success"
          onClick={() => handleUpdateStatus(order._id, "Shipped")}
        >
          Mark as Shipped
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleCancelOrder(order._id)}
        >
          Cancel Order
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
