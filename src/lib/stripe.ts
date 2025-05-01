import { loadStripe } from '@stripe/stripe-js';

// Hardcoded publishable key (this is OK as publishable keys are meant to be public)
const stripePublishableKey = 'pk_live_51RIzYUJjRarA6eH81NR6FNjH0BCkFBoM13yCsXlKrfb1J32ZPpSYJmKt8XV8P1brI51ismmIPZ1Ggr4zeku0f8Vz00ziC9Fplm';

export const stripePromise = loadStripe(stripePublishableKey);

// Price IDs from Stripe dashboard
export const PRICE_IDS = {
  MONTHLY: 'price_1RJumRJjRarA6eH84kygqd80',
  ANNUAL: 'price_1RJumvJjRarA6eH8KTvJCoGL',
}; 