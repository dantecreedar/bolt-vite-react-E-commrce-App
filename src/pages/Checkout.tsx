import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Checkout: React.FC = () => {
  const [address, setAddress] = useState('');
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to complete the purchase.');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: cart,
        total,
        address,
        createdAt: new Date(),
        status: 'pending'
      });

      clearCart();
      alert('Order placed successfully!');
      navigate('/purchase-history');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2">Shipping Address</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xl font-semibold mt-2">Total: ${total.toFixed(2)}</p>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;