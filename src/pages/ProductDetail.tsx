import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4 rounded" />
      <p className="text-xl font-semibold mb-2">${product.price.toFixed(2)}</p>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="mb-2">Category: {product.category}</p>
      <p className="mb-4">Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
      <button
        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 })}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        disabled={!product.availability}
      >
        {product.availability ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductDetail;