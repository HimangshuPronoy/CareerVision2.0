
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSubscription?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAuth = true, requireSubscription = true }) => {
  const { user, loading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  if (loading || subscriptionLoading) {
    // Show loading state while checking authentication or subscription
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

  // Check subscription if required
  if (requireAuth && requireSubscription && user && !subscription.isActive) {
    // Redirect to pricing page if subscription is required but user doesn't have one
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
