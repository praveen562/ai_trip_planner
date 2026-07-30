import React from 'react';
import { motion } from 'framer-motion';

const Trips: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <section className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">My Trips</h1>
          <p className="text-lg text-center mb-12">Manage your travel plans</p>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Paris Spring Adventure</h3>
              <p className="text-gray-600 mb-2">March 15-22, 2024</p>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Confirmed</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Tokyo Autumn Escape</h3>
              <p className="text-gray-600 mb-2">November 5-12, 2024</p>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Planning</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
              + Create New Trip
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Trips;
