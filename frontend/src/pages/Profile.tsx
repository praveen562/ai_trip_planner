import React from 'react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <section className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Profile</h1>
          <p className="text-lg text-center mb-12">Manage your account settings</p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">JP</span>
                </div>
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-gray-600">john.doe@example.com</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Full Name</span>
                  <span className="font-medium">John Doe</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Email</span>
                  <span className="font-medium">john.doe@example.com</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Travel Preferences</span>
                  <span className="font-medium">Adventure, Culture, Food</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Profile;
