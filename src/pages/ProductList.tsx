import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  availability: boolean;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <Link to={`/products/${product.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
                <button
                  onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 })}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={!product.availability}
                >
                  {product.availability ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;