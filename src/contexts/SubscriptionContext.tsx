import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

const SUPABASE_URL = "https://lxnmvvldfjmpoqsdhaug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bm12dmxkZmptcG9xc2RoYXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTI0ODIsImV4cCI6MjA1ODcyODQ4Mn0.sUx3Ee_1NFtyjlzorybqkka-nEyjqpzImh4kEfPbsAE";

// Flag to use mock data (set to true for testing without actual Stripe/Supabase)
const USE_MOCK_DATA = false;

interface SubscriptionStatus {
  isActive: boolean;
  plan: 'free' | 'monthly' | 'yearly' | null;
  currentPeriodEnd: Date | null;
  loading: boolean;
}

interface SubscriptionContextType {
  subscription: SubscriptionStatus;
  refreshSubscription: () => Promise<void>;
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
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    plan: null,
    currentPeriodEnd: null,
    loading: true,
  });

  // Set up mock data function
  const useMockSubscription = () => {
    // Get subscription status from localStorage for persistence
    const storedPlan = localStorage.getItem('mockSubscriptionPlan');
    
    // Default to free if nothing in storage
    let plan: 'free' | 'monthly' | 'yearly' | null = storedPlan as 'free' | 'monthly' | 'yearly' | null || 'free';
    
    // Check URL for /subscription/success to simulate successful Stripe checkout
    if (window.location.pathname === '/subscription/success') {
      // Success page typically means a new subscription was added
      const potentialNewPlan = new URLSearchParams(window.location.search).get('plan');
      if (potentialNewPlan === 'monthly' || potentialNewPlan === 'yearly') {
        plan = potentialNewPlan;
        localStorage.setItem('mockSubscriptionPlan', plan);
      } else {
        // Default to monthly if no plan specified
        plan = 'monthly';
        localStorage.setItem('mockSubscriptionPlan', plan);
      }
    }
    
    // Calculate period end (1 month later for monthly, 1 year later for yearly)
    const currentPeriodEnd = new Date();
    if (plan === 'monthly') {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else if (plan === 'yearly') {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }
    
    return {
      isActive: plan === 'monthly' || plan === 'yearly',
      plan,
      currentPeriodEnd: plan === 'free' ? null : currentPeriodEnd,
      loading: false,
    };
  };

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription({
        isActive: false,
        plan: null,
        currentPeriodEnd: null,
        loading: false,
      });
      return;
    }

    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      setSubscription(useMockSubscription());
      return;
    }

    try {
      // Call the Supabase function directly with fetch
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-subscription-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            customerId: user.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get subscription status');
      }

      const data = await response.json();

      if (data && data.subscription) {
        setSubscription({
          isActive: data.subscription.isActive,
          plan: data.subscription.plan,
          currentPeriodEnd: data.subscription.currentPeriodEnd ? new Date(data.subscription.currentPeriodEnd) : null,
          loading: false,
        });
      } else {
        setSubscription({
          isActive: false,
          plan: null,
          currentPeriodEnd: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription information.',
        variant: 'destructive',
      });
      setSubscription({
        isActive: false,
        plan: null,
        currentPeriodEnd: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user, window.location.pathname]);

  const refreshSubscription = async () => {
    setSubscription(prev => ({ ...prev, loading: true }));
    await fetchSubscription();
  };

  const value = {
    subscription,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 