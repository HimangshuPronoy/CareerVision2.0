import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16',
})

// This is needed to handle CORS preflight requests
async function handleCors(req: Request): Promise<Response | null> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = await handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get request body
    const requestData = await req.json()
    const { customerId } = requestData

    console.log(`Request received to get-subscription-status for customer: ${customerId ? customerId.substring(0, 4) + '...' : 'none'}`)

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: 'Customer ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // First, we need to find the Stripe customer ID for this Supabase user
    let stripeCustomerId: string | undefined;
    let stripeSubscription = null;

    try {
      // Try to find customer by metadata
      const customerSearch = await stripe.customers.search({
        query: `metadata['userId']:'${customerId}'`,
        limit: 1,
      });

      if (customerSearch.data.length > 0) {
        stripeCustomerId = customerSearch.data[0].id;
        console.log(`Found Stripe customer: ${stripeCustomerId} for user: ${customerId}`);
        
        // Verify the customer exists and can be retrieved
        try {
          await stripe.customers.retrieve(stripeCustomerId);
          
          // Get all subscriptions for this customer
          const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            limit: 1,
            status: 'all',
            expand: ['data.default_payment_method'],
          });
          
          if (subscriptions.data.length > 0) {
            stripeSubscription = subscriptions.data[0];
            console.log(`Found subscription: ${stripeSubscription.id} with status: ${stripeSubscription.status}`);
          } else {
            console.log(`No subscriptions found for customer: ${stripeCustomerId}`);
          }
        } catch (retrieveError) {
          console.error(`Error retrieving customer ${stripeCustomerId}:`, retrieveError);
          // Customer couldn't be retrieved, consider it non-existent
        }
      } else {
        console.log(`No Stripe customer found for user: ${customerId}`);
      }
    } catch (error) {
      console.error('Error searching for customer or subscription:', error);
    }

    // Format subscription data for response
    let subscriptionData = null;
    
    if (stripeSubscription) {
      // Determine plan type from product/price
      let plan = 'free';
      
      try {
        const priceId = stripeSubscription.items.data[0].price.id;
        if (priceId === 'price_1RJumRJjRarA6eH84kygqd80') {
          plan = 'monthly';
        } else if (priceId === 'price_1RJumvJjRarA6eH8KTvJCoGL') {
          plan = 'yearly';
        }
      } catch (error) {
        console.error('Error determining plan type:', error);
      }

      // Check if subscription is active
      const isActive = stripeSubscription.status === 'active' || 
                      stripeSubscription.status === 'trialing';
      
      subscriptionData = {
        isActive,
        plan,
        status: stripeSubscription.status,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      };
    } else {
      // No subscription found
      subscriptionData = {
        isActive: false,
        plan: 'free',
        status: 'none',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    return new Response(
      JSON.stringify({ 
        subscription: subscriptionData,
        stripeCustomerId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error getting subscription status:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}) 