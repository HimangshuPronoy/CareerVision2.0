
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border border-gray-200/20 shadow-lg rounded-xl sm:rounded-2xl' 
        : 'bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900">CareerVision</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base">
              Home
            </Link>
            <Link to="/features" className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base">
              Pricing
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base">
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full text-xs sm:text-sm px-3 sm:px-4">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="rounded-full text-xs sm:text-sm">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full text-xs sm:text-sm px-3 sm:px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/20 rounded-b-xl sm:rounded-b-2xl mt-1">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-gray-900 transition-colors font-medium py-2">
              Home
            </Link>
            <Link to="/features" className="block text-gray-700 hover:text-gray-900 transition-colors font-medium py-2">
              Features
            </Link>
            <Link to="/pricing" className="block text-gray-700 hover:text-gray-900 transition-colors font-medium py-2">
              Pricing
            </Link>
            {user && (
              <Link to="/dashboard" className="block text-gray-700 hover:text-gray-900 transition-colors font-medium py-2">
                Dashboard
              </Link>
            )}
            <div className="pt-3 sm:pt-4 border-t border-gray-200">
              {user ? (
                <Link to="/dashboard">
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="w-full mb-2 rounded-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
