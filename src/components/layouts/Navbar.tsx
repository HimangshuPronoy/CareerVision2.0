import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl md:text-3xl font-bold gradient-text">CareerVision</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-careervision-100 text-careervision-800 dark:bg-careervision-900 dark:text-careervision-300 rounded-full">
                Waitlist
              </span>
            </Link>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-6">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Home
            </Link>
            <a href="#features" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Features
            </a>
            <Link to="/terms" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#waitlist">
              <Button className="rounded-full shadow-md bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600 transition-all duration-300 hover:shadow-lg border-0">
                Join Waitlist
              </Button>
            </a>
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg" 
          id="mobile-menu"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              Home
            </Link>
            <a href="#features" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              Features
            </a>
            <Link to="/terms" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              Privacy
            </Link>
          </div>
          <div className="pt-4 pb-6 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 space-y-3">
              <a href="#waitlist" className="block w-full px-4 py-3 text-center rounded-lg text-base font-medium bg-gradient-to-r from-careervision-500 to-insight-500 text-white hover:from-careervision-600 hover:to-insight-600 shadow-md transition-all duration-300">
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
