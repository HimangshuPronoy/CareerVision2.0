// This script directly tests the create-checkout-session Supabase Edge Function
// Run with Node.js after adding your JWT token

const fetch = require('node-fetch');

// Configuration - REPLACE THESE VALUES
const ACCESS_TOKEN = 'YOUR_JWT_ACCESS_TOKEN'; // Get this from your browser localStorage
const USER_ID = 'YOUR_USER_ID'; // Your Supabase user ID
const SUPABASE_URL = 'https://lxnmvvldfjmpoqsdhaug.supabase.co';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/swift-task`; // Your edge function
const PRICE_ID = 'price_1RJumRJjRarA6eH84kygqd80'; // Monthly price ID

async function testCheckoutSession() {
  console.log('Testing create-checkout-session edge function...');
  console.log(`URL: ${FUNCTION_URL}`);
  console.log(`Price ID: ${PRICE_ID}`);
  console.log(`User ID: ${USER_ID}`);
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        priceId: PRICE_ID,
        userId: USER_ID,
      }),
    });
    
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      if (data.url) {
        console.log('✅ SUCCESS! Checkout URL:', data.url);
      } else if (data.error) {
        console.error('❌ ERROR:', data.error);
      }
    } catch (e) {
      console.error('❌ Invalid JSON response');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testCheckoutSession(); 