import { loadStripe } from '@stripe/stripe-js';

// Stripe public key (available in the Stripe dashboard)
const STRIPE_PUBLIC_KEY = 'pk_test_51RJuk1JjRarA6eH8vk9vkuAKrLfB22RlNJUYMavmXjSL9UvBc9IeALfxaDBLv8Qmw0f1PEzlDJw6OhQFFdkJfRFA00rE2QmJxT';

// Defined product price IDs (available in the Stripe dashboard)
export const PRICE_IDS = {
  MONTHLY: 'price_1RJumRJjRarA6eH84kygqd80',
  YEARLY: 'price_1RJumvJjRarA6eH8KTvJCoGL',
};

// Initialize Stripe with the public key
export const getStripe = async () => {
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  return stripePromise;
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