import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  total: number;
  createdAt: Date;
  status: string;
}

const PurchaseHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orderList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Order));
    setOrders(orderList);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
      {orders.length === 0 ? (
        <p>You haven't made any purchases yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded">
              <p className="font-semibold">Order ID: {order.id}</p>
              <p>Date: {order.createdAt.toLocaleString()}</p>
              <p>Status: {order.status}</p>
              <ul className="mt-2">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="font-semibold mt-2">Total: ${order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;