import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2025-03-31.basil',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    const { action, data } = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    switch (action) {
      case 'create-checkout-session': {
        const { priceId } = data;
        
        // Get or create customer
        let customer;
        const { data: existingCustomer } = await supabase
          .from('subscriptions')
          .select('stripe_customer_id')
          .eq('user_id', user.id)
          .single();

        if (existingCustomer?.stripe_customer_id) {
          customer = existingCustomer.stripe_customer_id;
        } else {
          const newCustomer = await stripe.customers.create({
            email: user.email,
            metadata: {
              user_id: user.id
            }
          });
          customer = newCustomer.id;
        }

        const session = await stripe.checkout.sessions.create({
          customer,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${Deno.env.get('FRONTEND_URL')}/dashboard?success=true`,
          cancel_url: `${Deno.env.get('FRONTEND_URL')}/pricing?canceled=true`,
          metadata: {
            user_id: user.id,
            plan_type: priceId.includes('month') ? 'monthly' : 'yearly'
          }
        });

        return new Response(JSON.stringify({ session }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'create-portal-session': {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('stripe_customer_id')
          .eq('user_id', user.id)
          .single();

        if (!subscription?.stripe_customer_id) {
          throw new Error('No subscription found');
        }

        const session = await stripe.billingPortal.sessions.create({
          customer: subscription.stripe_customer_id,
          return_url: `${Deno.env.get('FRONTEND_URL')}/dashboard`,
        });

        return new Response(JSON.stringify({ session }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}); 