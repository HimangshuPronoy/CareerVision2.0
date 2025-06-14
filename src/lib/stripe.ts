// Price IDs direct from Stripe dashboard
export const PRICE_IDS = {
  BASIC_MONTHLY: 'price_1Pya9ZJjRarA6eH8wxc1e9i4',
  BASIC_YEARLY: 'price_1PyaA0JjRarA6eH8Zx7Yb2pR',
  STANDARD_MONTHLY: 'price_1RZqBRJjRarA6eH8MQhkccmL',
  STANDARD_YEARLY: 'price_1PyaA1JjRarA6eH8kJ2bL5mN',
  LIFETIME: 'price_1RZqDvJjRarA6eH8BJsvfBqf',
} as const;

// Constants for subscription plans
export const PLANS = {
  FREE: 'free',
  BASIC_MONTHLY: 'basic_monthly',
  BASIC_YEARLY: 'basic_yearly',
  STANDARD_MONTHLY: 'standard_monthly',
  STANDARD_YEARLY: 'standard_yearly',
  LIFETIME: 'lifetime'
} as const;

// Pricing constants (in USD)
export const BASIC_MONTHLY_PRICE = 9.99;
export const BASIC_YEARLY_PRICE = 95.88; // $7.99/month equivalent

export const STANDARD_MONTHLY_PRICE = 17.99;
export const STANDARD_YEARLY_PRICE = 191.88; // $15.99/month equivalent

export const LIFETIME_PRICE = 99.00;

// Subscription prices for display
export const PRICES = {
  BASIC_MONTHLY: 14.99,
  BASIC_YEARLY: 129.99,
  BASIC_YEARLY_MONTHLY_EQUIVALENT: 10.83, // $129.99 / 12
  STANDARD_MONTHLY: 17.99,
  STANDARD_YEARLY: 179.99,
  STANDARD_YEARLY_MONTHLY_EQUIVALENT: 15.00, // $179.99 / 12
  LIFETIME: 99.00
};

// Use this to calculate savings for yearly plan
export const BASIC_YEARLY_SAVINGS = Math.round((PRICES.BASIC_MONTHLY * 12) - PRICES.BASIC_YEARLY);
export const STANDARD_YEARLY_SAVINGS = Math.round((PRICES.STANDARD_MONTHLY * 12) - PRICES.STANDARD_YEARLY);

export const BASIC_YEARLY_SAVINGS_PERCENTAGE = Math.round(((BASIC_MONTHLY_PRICE * 12) - BASIC_YEARLY_PRICE) / (BASIC_MONTHLY_PRICE * 12) * 100);
export const STANDARD_YEARLY_SAVINGS_PERCENTAGE = Math.round(((STANDARD_MONTHLY_PRICE * 12) - STANDARD_YEARLY_PRICE) / (STANDARD_MONTHLY_PRICE * 12) * 100);