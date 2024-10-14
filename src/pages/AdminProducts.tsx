import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  availability: boolean;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    setProducts(productList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image && !editingProduct) {
      alert('Please select an image');
      return;
    }

    try {
      let imageUrl = editingProduct ? editingProduct.imageUrl : '';

      if (image) {
        const storageRef = ref(storage, `product-images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        name,
        price: parseFloat(price),
        description,
        imageUrl,
        category,
        availability
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      clearForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding/updating product:', error);
      alert('There was an error adding/updating the product. Please try again.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
    setAvailability(product.availability);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('There was an error deleting the product. Please try again.');
      }
    }
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setCategory('');
    setAvailability(true);
    setImage(null);
    setEditingProduct(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block mb-2">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block mb-2">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="availability" className="block mb-2">Availability</label>
            <select
              id="availability"
              value={availability.toString()}
              onChange={(e) => setAvailability(e.target.value === 'true')}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block mb-2">Image</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="w-full px-3 py-2 border rounded"
              accept="image/*"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button type="button" onClick={clearForm} className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel Edit
          </button>
        )}
      </form>

      <h3 className="text-xl font-semibold mb-4">Product List</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-2 rounded" />
            <h4 className="text-lg font-semibold">{product.name}</h4>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
            <p className="text-sm mb-2">Category: {product.category}</p>
            <p className="text-sm mb-2">Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
            <div className="flex justify-between">
              <button onClick={() => handleEdit(product)} className="text-blue-500 hover:underline">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;