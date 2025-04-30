import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PUBLISHABLE_KEY } from '@/config/stripe';

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const createCheckoutSession = async (priceId: string) => {
  try {
    const { data: { session }, error } = await supabase.functions.invoke('stripe', {
      body: { action: 'create-checkout-session', data: { priceId } }
    });

    if (error) throw error;

    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe failed to initialize');

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (stripeError) throw stripeError;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createCustomer = async (email: string) => {
  try {
    const { data: { customer }, error } = await supabase.functions.invoke('stripe', {
      body: { action: 'create-customer', data: { email } }
    });

    if (error) throw error;
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const createPortalSession = async () => {
  try {
    const { data: { session }, error } = await supabase.functions.invoke('stripe', {
      body: { action: 'create-portal-session' }
    });

    if (error) throw error;
    if (!session.url) throw new Error('No portal URL returned');

    window.location.href = session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}; 