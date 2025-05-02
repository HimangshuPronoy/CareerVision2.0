import { loadStripe } from '@stripe/stripe-js';

// Stripe public key (available in the Stripe dashboard)
const STRIPE_PUBLIC_KEY = 'pk_live_51RIzYUJjRarA6eH8LlPYyW8gbQWbPzN7lZMzuwDeu2I2W2f9YNQ54PUIczUAdVBpzkwUm0NWowrEuzLU78cKEZWl00BvwArCSt';

// Defined product price IDs (available in the Stripe dashboard)
export const PRICE_IDS = {
  MONTHLY: 'price_1RJumRJjRarA6eH84kygqd80',
  YEARLY: 'price_1RJumvJjRarA6eH8KTvJCoGL',
};

// Cache Stripe instance to avoid multiple loads
let stripePromise: Promise<any> | null = null;

// Initialize Stripe with the public key
export const getStripe = async () => {
  if (!stripePromise) {
    console.log('Initializing Stripe with public key:', STRIPE_PUBLIC_KEY);
    
    // Add options parameter to fix localization issues
    const options = {
      locale: 'auto' as const, // Type assertion to fix type issue
      loader: 'always' as const, // Always load fresh to avoid caching issues
    };
    
    try {
      stripePromise = loadStripe(STRIPE_PUBLIC_KEY, options);
    } catch (initError) {
      console.error('Error during Stripe initialization:', initError);
      return null;
    }
  }
  
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Failed to initialize Stripe');
      return null;
    }
    return stripe;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    // Clear the promise to allow retry on next attempt
    stripePromise = null;
    return null;
  }
};

// Helper function to generate direct checkout URL (bypassing redirectToCheckout)
export const getDirectCheckoutUrl = (sessionId: string) => {
  return `https://checkout.stripe.com/c/pay/${sessionId}`;
};

// Constants for subscription plans
export const PLANS = {
  FREE: 'free',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

// Subscription prices for display
export const PRICES = {
  MONTHLY: 14.99,
  YEARLY: 129.99,
  YEARLY_MONTHLY_EQUIVALENT: 10.83, // $129.99 / 12
};

// Use this to calculate savings for yearly plan
export const YEARLY_SAVINGS = ((PRICES.MONTHLY * 12) - PRICES.YEARLY).toFixed(2);
export const YEARLY_SAVINGS_PERCENTAGE = Math.round(((PRICES.MONTHLY * 12) - PRICES.YEARLY) / (PRICES.MONTHLY * 12) * 100); 