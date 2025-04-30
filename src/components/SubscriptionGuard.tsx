import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from '@/components/ui/use-toast';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const { isSubscribed, loading } = useSubscription();

  if (!user) {
    toast({
      title: 'Authentication Required',
      description: 'Please sign in to access this feature.',
      variant: 'destructive',
    });
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isSubscribed()) {
    toast({
      title: 'Subscription Required',
      description: 'Please subscribe to access this feature.',
      variant: 'destructive',
    });
    return <Navigate to="/pricing" />;
  }

  return <>{children}</>;
}; 