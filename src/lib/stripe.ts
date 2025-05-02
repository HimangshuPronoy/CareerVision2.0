import { loadStripe } from '@stripe/stripe-js';

// Hardcoded publishable key (this is OK as publishable keys are meant to be public)
const stripePublishableKey = 'pk_live_51RIzYUJjRarA6eH81NR6FNjH0BCkFBoM13yCsXlKrfb1J32ZPpSYJmKt8XV8P1brI51ismmIPZ1Ggr4zeku0f8Vz00ziC9Fplm';

export const stripePromise = loadStripe(stripePublishableKey);

// Price IDs from Stripe dashboard - these may need to be updated to match your current products
// Please check your Stripe Dashboard > Products for the correct IDs
export const PRICE_IDS = {
  // If your price IDs are incorrect, replace them with the ones from your Stripe Dashboard
  MONTHLY: 'price_1Tl2bHJjRarA6eH8rHxlQbJy', // Example updated ID
  ANNUAL: 'price_1Tl2cfJjRarA6eH89FPFgGnW',  // Example updated ID
}; 