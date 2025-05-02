import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
})

// Initialize the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Webhook signature missing' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get the raw request body
    const body = await req.text()

    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || '',
      )
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Event type: ${event.type}`)

    // Handle specific event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        {
          const subscription = event.data.object
          const customerId = subscription.customer
          
          // Get user ID from subscription metadata
          const userId = subscription.metadata?.userId || 
                       subscription.metadata?.user_id || 
                       null
          
          if (userId) {
            // Update user's subscription status in your database
            // This is just an example, adjust according to your data model
            const { error } = await supabase
              .from('profiles')
              .update({
                subscription_status: subscription.status,
                subscription_id: subscription.id,
                subscription_price_id: subscription.items.data[0].price.id,
                subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId)
            
            if (error) {
              console.error('Error updating user subscription:', error)
            }
          }
        }
        break

      case 'customer.subscription.deleted':
        {
          const subscription = event.data.object
          const customerId = subscription.customer
          
          // Get user ID from subscription metadata
          const userId = subscription.metadata?.userId || 
                       subscription.metadata?.user_id || 
                       null
          
          if (userId) {
            // Update user's subscription status in your database
            const { error } = await supabase
              .from('profiles')
              .update({
                subscription_status: 'inactive',
                subscription_id: null,
                subscription_price_id: null,
                subscription_period_end: null,
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId)
            
            if (error) {
              console.error('Error updating user subscription:', error)
            }
          }
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}) 