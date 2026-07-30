import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a href="/" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
