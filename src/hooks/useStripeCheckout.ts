import { useState } from 'react';
import { getStripe, PRICE_IDS, getDirectCheckoutUrl } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SUPABASE_URL = "https://lxnmvvldfjmpoqsdhaug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bm12dmxkZmptcG9xc2RoYXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTI0ODIsImV4cCI6MjA1ODcyODQ4Mn0.sUx3Ee_1NFtyjlzorybqkka-nEyjqpzImh4kEfPbsAE";

// Flag to use mock data (set to true to bypass Stripe/Supabase and use local testing mode)
// IMPORTANT: If you're experiencing issues with Stripe integration, set this to 'true'
// to test the UI flow without actual API calls.
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

      console.log('Session ID received:', data.sessionId);

      // Instead of using redirectToCheckout which can cause preload errors,
      // directly navigate to the Stripe hosted checkout page
      const sessionId = data.sessionId;
      const checkoutUrl = getDirectCheckoutUrl(sessionId);
      
      console.log('Redirecting directly to Stripe checkout URL:', checkoutUrl);
      window.location.href = checkoutUrl;
      
      // Commented out the redirectToCheckout approach which caused preload errors
      /*
      // Load Stripe.js
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      console.log('Redirecting to Stripe checkout...');
      
      try {
        // Redirect to checkout page
        const { error: redirectError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (redirectError) {
          console.error('Redirect error details:', redirectError);
          
          // If we encounter a redirect error, use a direct URL redirect as fallback
          if (redirectError.message?.includes('expired') || redirectError.type === 'invalid_request_error') {
            // Direct redirect to Stripe checkout as a fallback
            window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
            return;
          }
          
          throw redirectError;
        }
      } catch (redirectCatchError) {
        console.error('Error during redirect:', redirectCatchError);
        // Handle any exceptions during the redirect process
        // Last resort fallback - direct URL
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      }
      */
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

      // Redirect to the customer portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to open customer portal. Please try again.',
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