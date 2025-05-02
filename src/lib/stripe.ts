import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// We'll fetch the publishable key from Supabase
let stripePromise: Promise<any> | null = null;

// Price IDs for the subscription plans
export const SUBSCRIPTION_PRICES = {
  MONTHLY: 'price_1RJumRJjRarA6eH84kygqd80',
  YEARLY: 'price_1RJumvJjRarA6eH8KTvJCoGL',
};

// Get the Stripe publishable key from Supabase
export const getStripePublishableKey = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'stripe_publishable_key')
      .single();

    if (error) throw error;
    return data.value;
  } catch (error) {
    console.error('Error fetching Stripe publishable key:', error);
    throw error;
  }
};

// Initialize Stripe
export const getStripe = async () => {
  if (!stripePromise) {
    const publishableKey = await getStripePublishableKey();
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Create a checkout session
export const createCheckoutSession = async (priceId: string, userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId, userId },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Check if user has an active subscription
export const checkSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, current_period_end, price_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return { isActive: false };
    
    const isActive = 
      data.status === 'active' || 
      data.status === 'trialing' || 
      (data.status === 'canceled' && new Date(data.current_period_end) > new Date());
    
    return { 
      isActive,
      plan: data.price_id === SUBSCRIPTION_PRICES.MONTHLY ? 'monthly' : 'yearly',
      expiresAt: data.current_period_end,
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { isActive: false };
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}; 