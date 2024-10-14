import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;