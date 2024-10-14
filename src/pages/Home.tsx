import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our E-commerce Store</h1>
      <p className="mb-8">Discover amazing products at great prices!</p>
      <Link to="/products" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Shop Now
      </Link>
    </div>
  );
};

export default Home;