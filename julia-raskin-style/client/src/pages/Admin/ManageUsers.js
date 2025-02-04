// client/src/pages/Admin/ManageUsers.js

import React, { useState } from 'react';

function ManageUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', role: 'user' },
    { id: 2, name: 'Bob', role: 'admin' },
  ]);

  const handleUpdateRole = (id, role) => {
    setUsers(users.map(user => user.id === id ? { ...user, role } : user));
  };

  return (
    <div className="container my-5">
      <h2>Manage Users</h2>
      <ul className="list-group">
        {users.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            {user.name} - {user.role}
            <select
              className="form-select"
              value={user.role}
              onChange={(e) => handleUpdateRole(user.id, e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageUsers;
