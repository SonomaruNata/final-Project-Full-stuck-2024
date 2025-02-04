// client/src/pages/Admin/ManageProducts.js

import React, { useState } from 'react';

function ManageProducts() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Red Dress', price: 120 },
    { id: 2, name: 'Blue Jeans', price: 85 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  const handleAddProduct = () => {
    const newId = products.length + 1;
    setProducts([...products, { id: newId, ...newProduct }]);
    setNewProduct({ name: '', price: '' });
  };

  return (
    <div className="container my-5">
      <h2>Manage Products</h2>
      <div className="mb-4">
        <h5>Add New Product</h5>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>
      <h5>Product List</h5>
      <ul className="list-group">
        {products.map((product) => (
          <li key={product.id} className="list-group-item">
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageProducts;
