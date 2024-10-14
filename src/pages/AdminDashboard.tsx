import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/products" className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-green-500 text-white p-4 rounded hover:bg-green-600">
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;