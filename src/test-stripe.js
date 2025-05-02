// This file is for testing Stripe price IDs
// Run with Node.js:
// 1. Add your Stripe secret key below
// 2. Run: node test-stripe.js

const stripe = require('stripe')('sk_YOUR_STRIPE_SECRET_KEY');

// These are the IDs we're using in the app
const priceIds = {
  MONTHLY: 'price_1RJumRJjRarA6eH84kygqd80',
  ANNUAL: 'price_1RJumvJjRarA6eH8KTvJCoGL'
};

async function testPriceIds() {
  console.log('Testing price IDs...');
  
  try {
    // Test MONTHLY price ID
    console.log(`Testing MONTHLY price ID: ${priceIds.MONTHLY}`);
    const monthlyPrice = await stripe.prices.retrieve(priceIds.MONTHLY);
    console.log('✅ MONTHLY price found:', {
      id: monthlyPrice.id,
      active: monthlyPrice.active,
      currency: monthlyPrice.currency,
      unit_amount: monthlyPrice.unit_amount,
      product: monthlyPrice.product
    });
  } catch (error) {
    console.error('❌ MONTHLY price error:', error.message);
  }
  
  try {
    // Test ANNUAL price ID
    console.log(`\nTesting ANNUAL price ID: ${priceIds.ANNUAL}`);
    const annualPrice = await stripe.prices.retrieve(priceIds.ANNUAL);
    console.log('✅ ANNUAL price found:', {
      id: annualPrice.id,
      active: annualPrice.active,
      currency: annualPrice.currency,
      unit_amount: annualPrice.unit_amount,
      product: annualPrice.product
    });
  } catch (error) {
    console.error('❌ ANNUAL price error:', error.message);
  }
}

testPriceIds(); 