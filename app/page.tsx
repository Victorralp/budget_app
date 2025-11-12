'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to E-Shop
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover amazing products at unbeatable prices
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your orders delivered quickly and safely
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your payment information is always protected
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                Only the best products for our customers
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse our collection of amazing products
            </p>
            <Link href="/products">
              <Button size="lg">
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
