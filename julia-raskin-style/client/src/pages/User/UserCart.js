import React from "react";

const UserCart = ({ cart }) => {
  return (
    <div className="user-cart">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.product._id} className="cart-item">
              <span>{item.product.name}</span>
              <span>Quantity: {item.quantity}</span>
              <button className="btn btn-sm btn-warning" onClick={() => alert("Edit Cart Coming Soon!")}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default UserCart;
