import { loadStripe } from '@stripe/stripe-js';

// Create a singleton to load the Stripe.js script on the client side
// Public key should be okay to expose in client-side code
const stripePromise = loadStripe('pk_test_51RKKawJjRarA6eH8RwG5lNLndbLBk1L8rCpk5z47t1QDEXRljK9hIBRMUTyh0EfNeBSKOdHDqWDn1cbNlTzOTOYy00sCGCjZFu');

export { stripePromise }; 