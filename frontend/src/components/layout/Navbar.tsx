import React from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
}

export const Navbar: React.FC = () => {
  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Trips', href: '/trips' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-xl font-bold text-primary">TravelMate</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`relative text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 rounded-md
                  ${window.location.pathname === item.href 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'border-b-2 border-transparent'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="ml-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
