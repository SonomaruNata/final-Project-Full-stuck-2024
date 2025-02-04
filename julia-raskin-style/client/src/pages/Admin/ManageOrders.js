

import React, { useState } from 'react';

function ManageOrders() {
  const [orders, setOrders] = useState([
    { id: 1, customer: 'Alice', total: 120, status: 'Pending' },
    { id: 2, customer: 'Bob', total: 85, status: 'Shipped' },
  ]);

  const handleUpdateStatus = (id, status) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
  };

  return (
    <div className="container my-5">
      <h2>Manage Orders</h2>
      <ul className="list-group">
        {orders.map(order => (
          <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
            {order.customer} - ${order.total} - {order.status}
            <button className="btn btn-sm btn-secondary" onClick={() => handleUpdateStatus(order.id, 'Shipped')}>
              Mark as Shipped
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageOrders;
