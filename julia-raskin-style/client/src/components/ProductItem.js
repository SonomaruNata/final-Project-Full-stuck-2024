// src/components/ProductItem.js
import React from "react";
import "./ProductItem.css";

const ProductItem = ({ product, handleEditProduct, handleDeleteProduct }) => {
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
      </div>
    </div>
  );
};

export default ProductItem;
