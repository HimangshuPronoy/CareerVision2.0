import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold gradient-text mb-4">CareerVision</span>
          <div className="flex space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
          
          <div className="flex space-x-8 mb-6">
            <Link to="/terms" className="text-sm text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CareerVision. All rights reserved.
          </p>
          
          <div className="mt-4 text-xs text-gray-400 max-w-md">
            Currently in development. Join our waitlist to be notified when we launch.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
