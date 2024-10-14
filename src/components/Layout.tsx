import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, User, LogOut, ShoppingBag } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">E-commerce App</h1>
        </div>
        <nav className="mt-4">
          <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Home</Link>
          <Link to="/products" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Products</Link>
          {currentUser && (
            <Link to="/purchase-history" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Purchase History</Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin/products" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Manage Products</Link>
              <Link to="/admin/orders" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Manage Orders</Link>
            </>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center">
              {currentUser ? (
                <>
                  <Link to="/cart" className="mr-4 text-gray-600 hover:text-gray-800">
                    <ShoppingCart size={24} />
                  </Link>
                  <Link to="/purchase-history" className="mr-4 text-gray-600 hover:text-gray-800">
                    <ShoppingBag size={24} />
                  </Link>
                  <span className="mr-4 text-gray-600">{currentUser.email}</span>
                  <button onClick={logout} className="text-gray-600 hover:text-gray-800">
                    <LogOut size={24} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-800 mr-4">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-600 hover:text-gray-800">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;