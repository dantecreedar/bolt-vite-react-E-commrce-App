import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  total: number;
  address: string;
  createdAt: Date;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orderList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Order));
    setOrders(orderList);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">User Email</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-4 py-2 border">{order.id}</td>
                <td className="px-4 py-2 border">{order.userEmail}</td>
                <td className="px-4 py-2 border">
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>{item.name} x {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border">${order.total.toFixed(2)}</td>
                <td className="px-4 py-2 border">{order.address}</td>
                <td className="px-4 py-2 border">{order.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;