'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    imageUrl: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Headphones',
    category: 'Electronics',
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 299.99,
    imageUrl: 'https://placehold.co/400x300/7C3AED/FFFFFF?text=Smart+Watch',
    category: 'Electronics',
    stock: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    description: 'Durable and spacious laptop backpack',
    price: 79.99,
    imageUrl: 'https://placehold.co/400x300/2563EB/FFFFFF?text=Backpack',
    category: 'Accessories',
    stock: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Our Products</h1>
          
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-500 text-white px-4 py-3 rounded-lg mb-6"
            >
              {notification}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
