// This file is for testing Stripe price IDs
// Run with Node.js:
// 1. Add your Stripe secret key below (this is different from your publishable key)
// 2. Run: node test-stripe.js

// Your publishable key: pk_live_51RIzYUJjRarA6eH81NR6FNjH0BCkFBoM13yCsXlKrfb1J32ZPpSYJmKt8XV8P1brI51ismmIPZ1Ggr4zeku0f8Vz00ziC9Fplm
// Add your SECRET key below (starts with sk_live_...)
const stripe = require('stripe')('sk_YOUR_STRIPE_SECRET_KEY');

// These are the IDs we're using in the app - let's check if they're valid
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