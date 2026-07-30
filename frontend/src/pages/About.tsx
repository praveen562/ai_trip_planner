import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <section className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-12">About TravelMate</h1>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-8 leading-relaxed">
              TravelMate is revolutionizing the way people plan their journeys. 
              We believe that travel should be about experiences, not stress and planning headaches.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  To make travel planning effortless, personalized, and enjoyable for everyone.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Story</h3>
                <p className="text-gray-600">
                  Founded by travel enthusiasts who were frustrated with complicated planning tools, 
                  we set out to create a solution that puts the joy back into travel preparation.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-6">What Makes Us Different</h3>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <span className="font-medium">AI-Powered Personalization:</span> Our advanced algorithms 
                  learn from your preferences to create truly unique itineraries.
                </li>
                <li>
                  <span className="font-medium">Beautiful Design:</span> Every interaction is crafted with 
                  attention to detail for a premium experience.
                </li>
                <li>
                  <span className="font-medium">Comprehensive Coverage:</span> From flights and accommodations 
                  to local experiences and dining recommendations.
                </li>
                <li>
                  <span className="font-medium">Offline Access:</span> Access your plans anywhere, even without internet.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
