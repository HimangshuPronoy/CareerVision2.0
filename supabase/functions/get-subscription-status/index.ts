import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
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
    const { customerId } = await req.json()

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: 'Customer ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
    })

    // No active subscriptions
    if (subscriptions.data.length === 0) {
      return new Response(
        JSON.stringify({ subscription: null }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get the most recent subscription
    const subscription = subscriptions.data[0]

    // Get the price's lookup key to determine the plan
    const priceId = subscription.items.data[0].price.id

    // Determine the plan based on price ID
    let plan = null
    if (priceId === 'price_1RJumRJjRarA6eH84kygqd80') {
      plan = 'monthly'
    } else if (priceId === 'price_1RJumvJjRarA6eH8KTvJCoGL') {
      plan = 'yearly'
    }

    return new Response(
      JSON.stringify({
        subscription: {
          id: subscription.id,
          isActive: subscription.status === 'active',
          plan,
          currentPeriodEnd: subscription.current_period_end * 1000, // Convert to milliseconds
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}) 