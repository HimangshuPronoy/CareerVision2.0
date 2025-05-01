import { loadStripe } from '@stripe/stripe-js';

// Replace with your own publishable key from the Stripe dashboard
// This should be stored in your .env file in a real application
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = loadStripe(stripePublishableKey);

// Price IDs from Stripe dashboard
export const PRICE_IDS = {
  MONTHLY: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || '',
  ANNUAL: import.meta.env.VITE_STRIPE_PRICE_ANNUAL || '',
}; 