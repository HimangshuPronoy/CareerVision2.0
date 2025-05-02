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

    console.log(`Request received to create-portal-session for user: ${customerId ? customerId.substring(0, 4) + '...' : 'none'}`)

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: 'Customer ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Find the Stripe customer ID if this is a Supabase user ID
    let stripeCustomerId = customerId;

    if (!customerId.startsWith('cus_')) {
      try {
        // Search for a customer with this userId in metadata
        const customerSearch = await stripe.customers.search({
          query: `metadata['userId']:'${customerId}'`,
          limit: 1,
        });

        if (customerSearch.data.length > 0) {
          // Customer exists, use the Stripe customer ID
          stripeCustomerId = customerSearch.data[0].id;
          console.log(`Found Stripe customer: ${stripeCustomerId} for user: ${customerId}`);
          
          // Verify the customer exists and can be retrieved
          try {
            await stripe.customers.retrieve(stripeCustomerId);
          } catch (retrieveError) {
            console.error(`Error retrieving customer ${stripeCustomerId}:`, retrieveError);
            return new Response(
              JSON.stringify({ 
                error: 'Customer could not be retrieved from Stripe',
                code: 'customer_retrieval_failed',
              }),
              {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            )
          }
        } else {
          console.log(`No Stripe customer found for user: ${customerId}`);
          return new Response(
            JSON.stringify({ 
              error: 'No subscription found for this customer',
              code: 'customer_not_found',
            }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }
      } catch (err) {
        console.error('Error searching for customer:', err);
        return new Response(
          JSON.stringify({ 
            error: 'Error finding customer',
            details: err.message,
            code: 'search_error',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Check if the customer has any subscriptions before creating a portal
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      console.log(`No subscriptions found for customer: ${stripeCustomerId}`);
      return new Response(
        JSON.stringify({ 
          error: 'No subscription found for this customer',
          code: 'no_subscription',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Creating portal session for customer: ${stripeCustomerId}`);

    // Create a portal session for the customer
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: Deno.env.get('BASE_URL') || 'http://localhost:8081',
    })

    console.log(`Portal session created: ${portalSession.id}, URL: ${portalSession.url}`);

    return new Response(
      JSON.stringify({ url: portalSession.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error creating portal session:', error.message);
    console.error(error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        code: error.code || 'unknown',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}) 