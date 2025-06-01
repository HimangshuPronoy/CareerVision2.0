import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

type SubscriptionPlan = 'monthly' | 'yearly' | 'premium' | null;

interface SubscriptionContextType {
  subscription: {
    isActive: boolean;
    plan: SubscriptionPlan;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  };
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  requireSubscription: (redirectPath?: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const defaultSubscription = {
    isActive: false,
    plan: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  };
  
  const [subscription, setSubscription] = useState(defaultSubscription);
  const [isLoading, setIsLoading] = useState(true);

  // Paths that don't require subscription
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/pricing',
    '/features',
    '/about',
    '/terms-of-service',
    '/privacy-policy',
    '/subscription-success',
    '/subscription-cancel'
  ];

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(defaultSubscription);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Call the Supabase edge function to get subscription status
      const { data, error } = await supabase.functions.invoke('get-subscription-status', {
        body: JSON.stringify({ customerId: user.id })
      });

      if (error) {
        console.error('Error fetching subscription:', error);
        toast.error('Failed to fetch subscription status');
        setSubscription(defaultSubscription);
      } else {
        if (data && data.subscription) {
          setSubscription({
            isActive: data.subscription.isActive,
            plan: data.subscription.plan,
            currentPeriodEnd: data.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd,
          });
        } else {
          setSubscription(defaultSubscription);
        }
      }
    } catch (error) {
      console.error('Error in subscription refresh:', error);
      toast.error('Failed to refresh subscription status');
      setSubscription(defaultSubscription);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setIsLoading(true);
    await fetchSubscription();
  };

  // Function to check if user has an active subscription and redirect if not
  const requireSubscription = (redirectPath = '/pricing') => {
    // If we're still loading, don't make any decisions yet
    if (isLoading) return true;

    // If user is on a public path, no subscription required
    if (publicPaths.includes(location.pathname)) return true;

    // If user has an active subscription, allow access
    if (user && subscription.isActive) return true;

    // Otherwise, redirect to pricing page
    if (user && !subscription.isActive && !publicPaths.includes(location.pathname)) {
      toast.error('You need an active subscription to access this feature');
      navigate(redirectPath);
      return false;
    }

    // If no user is logged in, redirect to login
    if (!user && !publicPaths.includes(location.pathname)) {
      toast.error('Please log in to access this feature');
      navigate('/login');
      return false;
    }

    return false;
  };

  useEffect(() => {
    refreshSubscription();
  }, [user]);

  // Check subscription status when route changes
  useEffect(() => {
    if (!isLoading && user && !subscription.isActive) {
      // Only check on protected routes
      if (!publicPaths.includes(location.pathname)) {
        toast.error('You need an active subscription to access this feature');
        navigate('/pricing');
      }
    }
  }, [location.pathname, isLoading, user, subscription.isActive]);

  return (
    <SubscriptionContext.Provider value={{ subscription, isLoading, refreshSubscription, requireSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};