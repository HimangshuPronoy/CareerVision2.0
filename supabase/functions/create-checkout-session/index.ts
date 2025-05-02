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
    const { priceId, userId } = await req.json();

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

    // Get user information
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }

    // Get application URL from config
    const { data: appUrlData, error: appUrlError } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'app_url')
      .single();

    if (appUrlError) {
      throw new Error(`Error fetching app URL: ${appUrlError.message}`);
    }

    const appUrl = appUrlData.value || 'http://localhost:3000';

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?subscription=success`,
      cancel_url: `${appUrl}/subscription?canceled=true`,
      customer_email: userData.email,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    // Return the session ID
    return new Response(
      JSON.stringify({ sessionId: session.id }),
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