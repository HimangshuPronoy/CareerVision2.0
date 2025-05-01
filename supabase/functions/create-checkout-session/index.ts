// @ts-ignore: Deno types are not recognized in a regular TypeScript environment
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore: Deno types are not recognized in a regular TypeScript environment
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';
// @ts-ignore: Deno types are not recognized in a regular TypeScript environment
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

// Deno global
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Updated CORS headers to allow requests from Netlify
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://careervisualize.netlify.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // Get request data
    const { priceId, userId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !user?.email) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });

    // Define success and cancel URLs
    const successUrl = Deno.env.get('PUBLIC_APP_URL') + '/payment-success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = Deno.env.get('PUBLIC_APP_URL') + '/payment-cancel';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 