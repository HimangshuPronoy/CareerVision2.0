// Placeholder file to maintain imports
// Stripe integration now uses direct URLs and fetch instead of the Stripe.js library

export const getCheckoutUrl = (sessionId: string) => {
  return `https://checkout.stripe.com/c/pay/${sessionId}`;
}; 