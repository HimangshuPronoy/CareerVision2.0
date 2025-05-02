import { useState } from 'react';
import { PRICE_IDS } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getCheckoutUrl } from '@/integrations/stripe/client';

const SUPABASE_URL = "https://lxnmvvldfjmpoqsdhaug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bm12dmxkZmptcG9xc2RoYXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTI0ODIsImV4cCI6MjA1ODcyODQ4Mn0.sUx3Ee_1NFtyjlzorybqkka-nEyjqpzImh4kEfPbsAE";

// Flag to use mock data (set to false to use the real Stripe integration)
// IMPORTANT: Set to true only for testing if Stripe integration issues persist
const USE_MOCK_DATA = false;

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

  // This function contains the main checkout session logic
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
      // Validate inputs before proceeding
      if (!priceId) {
        throw new Error('Price ID is required');
      }
      
      if (!SUPABASE_ANON_KEY) {
        throw new Error('Supabase key is missing. Check configuration.');
      }

      console.log(`Creating checkout session for price: ${priceId}, user: ${user.id}`);
      
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

      console.log('Response status:', response.status);
      
      // Handle 401 errors specifically
      if (response.status === 401) {
        console.error('Authorization error when calling Supabase function');
        throw new Error('Failed to authenticate with Supabase. Please refresh the page and try again.');
      }
      
      // Get the full response text for debugging
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      let data;
      try {
        // Try to parse as JSON if possible
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response as JSON:', parseError);
        throw new Error(`Invalid response format: ${responseText}`);
      }

      if (!response.ok) {
        console.error('Server error details:', data);
        if (data.error && data.error.includes('No such customer')) {
          throw new Error('Customer not found in Stripe. Please try again.');
        }
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      if (!data.sessionId) {
        console.error('Missing session ID in response:', data);
        throw new Error('No session ID returned from server');
      }

      // Log the entire checkout session data for debugging
      console.log('Checkout session data:', data);

      // Try to use the URL directly from response if available
      let checkoutUrl;
      if (data.url) {
        console.log('Using URL from response:', data.url);
        checkoutUrl = data.url;
      } else {
        console.log('Creating checkout URL from session ID:', data.sessionId);
        checkoutUrl = getCheckoutUrl(data.sessionId);
      }
      
      console.log('Opening Stripe checkout URL:', checkoutUrl);
      
      // For debugging - show the URL before redirecting
      toast({
        title: "Opening Stripe checkout",
        description: "You'll be redirected to Stripe to complete payment.",
      });
      
      // Add a small delay before redirecting to make sure we see the logs
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 500);
      
      return; // Keep loading state for the redirect
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      let errorMessage = 'Failed to start checkout process. Please try again later.';
      
      // Provide more helpful error messages for common issues
      if (error.message && error.message.includes('Cannot find module')) {
        errorMessage = 'Stripe module loading error. Please refresh and try again.';
      } else if (error.message && (error.message.includes('unauthorized') || error.message.includes('authenticate'))) {
        errorMessage = 'Authorization failed. Please refresh the page and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error Creating Checkout Session',
        description: errorMessage,
        variant: 'destructive',
      });
      
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
      console.log(`Creating portal session for user: ${user.id}`);
      
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

      console.log('Response status:', response.status);
      
      // Get the full response text for debugging
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      let data;
      try {
        // Try to parse as JSON if possible
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response as JSON:', parseError);
        throw new Error(`Invalid response format: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      if (!data.url) {
        throw new Error('No portal URL returned from server');
      }

      console.log('Portal URL received:', data.url);

      // Redirect to the customer portal - open in new window to avoid losing app state
      const newWindow = window.open(data.url, '_blank');
      
      // Fallback if popup is blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.log('Popup was blocked, using direct navigation instead');
        window.location.href = data.url;
      } else {
        // If popup worked, we can stop loading
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to open customer portal. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return {
    loading,
    createCheckoutSession,
    createPortalSession,
  };
}; 