import React from 'react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <section className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Welcome to TravelMate</h1>
          <p className="text-lg text-center mb-12">Your AI-powered travel planner</p>
          <div className="text-center">
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
