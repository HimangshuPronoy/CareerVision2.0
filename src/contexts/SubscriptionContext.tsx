import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkSubscription } from '@/lib/stripe';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  isSubscribed: boolean;
  plan: 'monthly' | 'yearly' | null;
  expiresAt: string | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  plan: null,
  expiresAt: null,
  isLoading: true,
  refreshSubscription: async () => {}
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [plan, setPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptionStatus = async () => {
    if (!user) {
      setIsSubscribed(false);
      setPlan(null);
      setExpiresAt(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { isActive, plan: subscriptionPlan, expiresAt: subscriptionExpiry } = await checkSubscription(user.id);
      setIsSubscribed(isActive);
      setPlan(isActive && subscriptionPlan ? (subscriptionPlan as 'monthly' | 'yearly') : null);
      setExpiresAt(isActive ? subscriptionExpiry : null);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
      setPlan(null);
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [user]);

  const refreshSubscription = async () => {
    await fetchSubscriptionStatus();
  };

  const value = {
    isSubscribed,
    plan,
    expiresAt,
    isLoading,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 