import React from 'react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <section className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>
          <p className="text-lg text-center mb-12">Your travel hub</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">My Trips</h3>
              <p className="text-gray-600">View and manage your upcoming trips</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Saved Places</h3>
              <p className="text-gray-600">Your favorite destinations and attractions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Travel Stats</h3>
              <p className="text-gray-600">Insights about your travel patterns</p>
            </div>
          </div>
          <div className="text-center">
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
              Plan New Trip
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
