import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Set this to false to enable app access when ready to launch
const APP_IN_WAITLIST = true;

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While app is in waitlist mode, redirect all attempted access to protected routes to the waitlist page
  if (APP_IN_WAITLIST && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-careervision-500"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login if authentication is required but user is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // Redirect to dashboard if user is already logged in and tries to access non-auth pages
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
