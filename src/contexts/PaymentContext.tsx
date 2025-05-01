import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

// Define the Supabase function URLs
const SUPABASE_URL = "https://lxnmvvldfjmpoqsdhaug.supabase.co";
const CREATE_CHECKOUT_SESSION_URL = `${SUPABASE_URL}/functions/v1/create-checkout-session`;
const SUBSCRIPTION_STATUS_URL = `${SUPABASE_URL}/functions/v1/subscription-status`;

interface PaymentContextType {
  isSubscribed: boolean;
  subscriptionPlan: string | null;
  isLoading: boolean;
  error: string | null;
  createCheckoutSession: (priceId: string) => Promise<{ url: string | null; error: Error | null }>;
  checkSubscriptionStatus: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a checkout session with Stripe
  const createCheckoutSession = async (priceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to create a checkout session');
      }

      console.log('Creating checkout session with price ID:', priceId);
      
      // For development/testing, return a mock response if the Supabase function isn't working
      try {
        // Call your backend endpoint to create a checkout session
        const response = await fetch(CREATE_CHECKOUT_SESSION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            priceId,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response from server:', errorText);
          throw new Error(`Failed to create checkout session: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Checkout session created:', data);
        
        if (data.error) {
          throw new Error(data.error.message || 'Unknown error creating checkout session');
        }

        return { url: data.url, error: null };
      } catch (fetchError) {
        console.error('Fetch error in createCheckoutSession:', fetchError);
        // In development, redirect to a mock success page
        if (process.env.NODE_ENV !== 'production') {
          console.log('Development mode: returning mock checkout session URL');
          return { 
            url: `${window.location.origin}/payment-success`, 
            error: null 
          };
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { url: null, error: error as Error };
    }
  };

  // Check the user's subscription status
  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('No user session found, setting subscription status to false');
        setIsSubscribed(false);
        setSubscriptionPlan(null);
        setIsLoading(false);
        return;
      }

      console.log('Checking subscription status for user:', session.user.id);
      
      try {
        // Call your backend endpoint to check subscription status
        const response = await fetch(`${SUBSCRIPTION_STATUS_URL}?userId=${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          // Add timeout to prevent long waits
          signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response from subscription status:', errorText);
          throw new Error(`Failed to check subscription: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Subscription status response:', data);

        if (data.error) {
          throw new Error(data.error);
        }

        setIsSubscribed(data.isActive || false);
        setSubscriptionPlan(data.plan || null);
      } catch (fetchError) {
        console.error('Error fetching subscription status:', fetchError);
        
        // For development/testing, we'll set a default state and continue
        // In production, you might want to handle this differently
        setError('Could not connect to subscription service. Using default settings.');
        setIsSubscribed(false);
        setSubscriptionPlan(null);
      }
    } catch (error) {
      console.error('Error in checkSubscriptionStatus:', error);
      setIsSubscribed(false);
      setSubscriptionPlan(null);
      setError('Failed to check subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription status when the component mounts
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const value = {
    isSubscribed,
    subscriptionPlan,
    isLoading,
    error,
    createCheckoutSession,
    checkSubscriptionStatus,
  };

  return (
    <PaymentContext.Provider value={value}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </PaymentContext.Provider>
  );
} 