import { useState } from 'react';
import { getStripe, PRICE_IDS } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SUPABASE_URL = "https://lxnmvvldfjmpoqsdhaug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bm12dmxkZmptcG9xc2RoYXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTI0ODIsImV4cCI6MjA1ODcyODQ4Mn0.sUx3Ee_1NFtyjlzorybqkka-nEyjqpzImh4kEfPbsAE";

// Flag to use mock data (set to true for testing without actual Stripe/Supabase)
const USE_MOCK_DATA = true;

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // This function bypasses Stripe for testing purposes
  const mockSubscription = (priceId: string) => {
    setLoading(true);
    
    let plan = 'monthly';
    
    // Determine which plan based on price ID
    if (priceId === PRICE_IDS.YEARLY) {
      plan = 'yearly';
    }
    
    setTimeout(() => {
      setLoading(false);
      window.location.href = `/subscription/success?plan=${plan}`;
    }, 1500);
    
    toast({
      title: "Test Subscription",
      description: `Using mock function to simulate ${plan} subscription`,
    });
  };

  const createCheckoutSession = async (priceId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to subscribe.',
        variant: 'destructive',
      });
      return;
    }

    // For testing/development, use the mock function if enabled
    if (USE_MOCK_DATA) {
      return mockSubscription(priceId);
    }

    setLoading(true);

    try {
      // Call the Supabase function directly with fetch
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            priceId,
            customerId: user.id,
            customerEmail: user.email,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();

      // Load Stripe.js
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Redirect to checkout page
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (redirectError) {
        throw redirectError;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: 'Failed to start checkout process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // This function bypasses Stripe for testing purposes
  const mockPortalManagement = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/settings';
    }, 1500);
    
    toast({
      title: "Test Portal",
      description: "Using mock function to simulate customer portal",
    });
  };

  const createPortalSession = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to manage your subscription.',
        variant: 'destructive',
      });
      return;
    }

    // For testing/development, use the mock function if enabled
    if (USE_MOCK_DATA) {
      return mockPortalManagement();
    }

    setLoading(true);

    try {
      // Call the Supabase function directly with fetch
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/create-portal-session`,
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
        throw new Error(errorData.error || 'Failed to create portal session');
      }

      const data = await response.json();

      // Redirect to the customer portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: 'Error',
        description: 'Failed to open customer portal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createCheckoutSession,
    createPortalSession,
  };
}; 