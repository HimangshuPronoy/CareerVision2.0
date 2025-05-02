import { loadStripe } from '@stripe/stripe-js';

// Create a singleton to load the Stripe.js script on the client side
// Public key should be okay to expose in client-side code
const stripePromise = loadStripe('pk_live_51RIzYUJjRarA6eH8LlPYyW8gbQWbPzN7lZMzuwDeu2I2W2f9YNQ54PUIczUAdVBpzkwUm0NWowrEuzLU78cKEZWl00BvwArCSt', {
  locale: 'auto', // Ensure locale is set to auto to avoid language issues
  apiVersion: '2023-10-16', // Explicitly set API version
  betas: ['checkout_beta_4'], // Use latest checkout features
});

// Export a function to safely get the Stripe instance
export async function getStripeInstance() {
  try {
    const stripe = await stripePromise;
    return stripe;
  } catch (error) {
    console.error('Failed to load Stripe:', error);
    return null;
  }
}

export { stripePromise }; 