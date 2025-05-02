import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

// Define the Supabase function URLs
const SUPABASE_URL = "https://lxnmvvldfjmpoqsdhaug.supabase.co";
// Use the correct slugs from the function list
const CREATE_CHECKOUT_SESSION_URL = `${SUPABASE_URL}/functions/v1/swift-task`;
const SUBSCRIPTION_STATUS_URL = `${SUPABASE_URL}/functions/v1/bright-handler`;
const STRIPE_WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/swift-action`;
// Add portal URL with the expected slug pattern (this will need to be updated with the real slug)
const CREATE_PORTAL_SESSION_URL = `${SUPABASE_URL}/functions/v1/gentle-lamp`;

// Debug info
console.log('Payment service URLs:', {
  checkout: CREATE_CHECKOUT_SESSION_URL,
  status: SUBSCRIPTION_STATUS_URL,
  webhook: STRIPE_WEBHOOK_URL,
  portal: CREATE_PORTAL_SESSION_URL
});

// Payment context type
type PaymentContextType = {
  isSubscribed: boolean;
  subscriptionPlan: string | null;
  isLoading: boolean;
  error: string | null;
  createCheckoutSession: (priceId: string) => Promise<{ url: string | null; error: string | null }>;
  checkSubscriptionStatus: () => Promise<void>;
  redirectToCustomerPortal: () => Promise<void>;
};

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
  const [isLoading, setIsLoading] = useState(false); // Changed to start not loading
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
      } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in checkout flow:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      return { url: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  // Redirect to Stripe Customer Portal
  const redirectToCustomerPortal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to access customer portal');
      }
      
      const session = await supabase.auth.getSession();
      
      console.log('Redirecting to customer portal for user:', user.id);
      
      // Call the Edge Function to create a portal session
      const response = await fetch(CREATE_PORTAL_SESSION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from portal session:', errorText);
        throw new Error(`Failed to create portal session: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Portal session created:', data);
      
      if (data.error) {
        throw new Error(data.error.message || 'Unknown error creating portal session');
      }

      // Redirect to the Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has an active subscription
  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const session = await supabase.auth.getSession();
      
      if (!session.data.session?.user) {
        console.log('No authenticated user found');
        setIsSubscribed(false);
        setSubscriptionPlan(null);
        return;
      }
      
      try {
        // First attempt with URL from constant
        console.log('Calling subscription status endpoint:', `${SUBSCRIPTION_STATUS_URL}?userId=${session.data.session.user.id}`);
        console.log('Headers:', { Authorization: `Bearer ${session.data.session.access_token}` });
        
        const response = await fetch(`${SUBSCRIPTION_STATUS_URL}?userId=${session.data.session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`,
          },
          // Remove timeout as it might cause issues
          // signal: AbortSignal.timeout(5000)
        });

        console.log('Response received:', response.status, response.statusText);
        console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));

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
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in subscription status flow:', error);
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Check subscription status on mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  return (
    <PaymentContext.Provider value={{ 
      isSubscribed, 
      subscriptionPlan, 
      isLoading, 
      error,
      createCheckoutSession,
      checkSubscriptionStatus,
      redirectToCustomerPortal
    }}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </PaymentContext.Provider>
  );
} 