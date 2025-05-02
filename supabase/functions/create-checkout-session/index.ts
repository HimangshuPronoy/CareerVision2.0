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
    const { priceId, customerId, customerEmail } = requestData
    
    console.log("Request received to create-checkout-session:", JSON.stringify({
      priceId,
      customerId: customerId ? `${customerId.substring(0, 4)}...` : 'none',
      customerEmail: customerEmail || 'none',
    }))

    // Validate Stripe API key before proceeding
    if (!Deno.env.get('STRIPE_SECRET_KEY')) {
      console.error('STRIPE_SECRET_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ 
          error: 'Stripe configuration error', 
          details: 'Server configuration error with Stripe API key'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Price ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Find or create a Stripe customer based on Supabase user ID
    let stripeCustomerId: string | undefined;
    
    if (customerId) {
      try {
        // First, try to find if this user already has a Stripe customer
        const customerSearch = await stripe.customers.search({
          query: `metadata['userId']:'${customerId}'`,
          limit: 1,
        });

        if (customerSearch.data.length > 0) {
          // Customer exists, use the Stripe customer ID
          stripeCustomerId = customerSearch.data[0].id;
          console.log(`Found existing Stripe customer: ${stripeCustomerId} for user: ${customerId}`);
          
          // Verify customer exists and can be retrieved
          try {
            await stripe.customers.retrieve(stripeCustomerId);
          } catch (retrieveError) {
            console.error(`Error retrieving customer ${stripeCustomerId}:`, retrieveError);
            // If we can't retrieve it, consider it non-existent and create a new one
            stripeCustomerId = undefined;
          }
        }
        
        // If no customer was found or the customer couldn't be retrieved, create a new one
        if (!stripeCustomerId && customerEmail) {
          const newCustomer = await stripe.customers.create({
            email: customerEmail,
            metadata: {
              userId: customerId,
            }
          });
          stripeCustomerId = newCustomer.id;
          console.log(`Created new Stripe customer: ${stripeCustomerId} for user: ${customerId}`);
        }
      } catch (err) {
        console.error('Error handling customer:', err);
        // If there's any search error, try to create a new customer 
        if (customerEmail) {
          try {
            const newCustomer = await stripe.customers.create({
              email: customerEmail,
              metadata: {
                userId: customerId,
              }
            });
            stripeCustomerId = newCustomer.id;
            console.log(`Created new Stripe customer (after error): ${stripeCustomerId} for user: ${customerId}`);
          } catch (createError) {
            console.error('Error creating customer:', createError);
            // Continue without customer info, will use customer_email instead
          }
        }
      }
    }
    
    // Determine subscription or one-time payment based on price
    let mode: 'subscription' | 'payment' = 'subscription'; // Default to subscription
    
    try {
      // Check if the price is a recurring price
      const price = await stripe.prices.retrieve(priceId);
      if (!price.recurring) {
        mode = 'payment';
      }
    } catch (error) {
      console.error('Error checking price:', error);
      // Default to subscription if we can't check
    }

    console.log(`Creating Stripe checkout session with mode: ${mode}`);

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${Deno.env.get('BASE_URL') || 'http://localhost:8081'}/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan=${priceId === 'price_1RJumRJjRarA6eH84kygqd80' ? 'monthly' : 'yearly'}`,
      cancel_url: `${Deno.env.get('BASE_URL') || 'http://localhost:8081'}/subscription/cancel`,
      client_reference_id: customerId,
      metadata: {
        userId: customerId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      expires_at: Math.floor(Date.now() / 1000) + 48 * 60 * 60, // 48 hours from now (longer expiration)
      payment_intent_data: {
        // Help capture payment faster and reduce failures
        setup_future_usage: 'off_session',
      },
      // Customize Stripe checkout appearance
      custom_text: {
        submit: {
          message: 'Your subscription will begin immediately after payment.',
        },
      },
    };

    // Add customer-related parameters if we have them
    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    // Add subscription specific parameters
    if (mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: {
          userId: customerId,
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(`Checkout session created: ${session.id}`);

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    console.error(error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        type: error.type || 'unknown',
        code: error.code || 'unknown'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 