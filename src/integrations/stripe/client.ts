// Simple helper for Stripe checkout URLs
// We're using Stripe in hosted mode, so we don't need any client-side initialization

/**
 * Returns the URL for a Stripe hosted checkout session
 */
export const getCheckoutUrl = (sessionId: string) => {
  return `https://checkout.stripe.com/c/pay/${sessionId}`;
}; 