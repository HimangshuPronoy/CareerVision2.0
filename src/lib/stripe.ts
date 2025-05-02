// Price IDs direct from Stripe dashboard
export const PRICE_IDS = {
  MONTHLY: 'price_1RJumRJjRarA6eH84kygqd80',
  YEARLY: 'price_1RJumvJjRarA6eH8KTvJCoGL',
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