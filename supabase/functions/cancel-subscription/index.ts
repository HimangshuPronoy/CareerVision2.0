import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3';
import Stripe from 'https://esm.sh/stripe@12.19.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { subscriptionId } = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Stripe secret key from Supabase
    const { data: configData, error: configError } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'stripe_secret_key')
      .single();

    if (configError) {
      throw new Error(`Error fetching Stripe secret key: ${configError.message}`);
    }

    // Initialize Stripe
    const stripe = new Stripe(configData.value, {
      apiVersion: '2023-10-16',
    });

    // Cancel the subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Return the result
    return new Response(
      JSON.stringify({ 
        success: true, 
        canceledAt: subscription.cancel_at,
        currentPeriodEnd: subscription.current_period_end
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
}); 