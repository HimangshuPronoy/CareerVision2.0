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
    const requestText = await req.text();
    console.log('Raw request body:', requestText);
    
    let requestData;
    try {
      requestData = JSON.parse(requestText);
      console.log('Parsed request data:', requestData);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { priceId, userId } = requestData;
    
    console.log('Processing checkout for:', { priceId, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get user data
    console.log('Fetching user data from profiles table');
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !user?.email) {
      console.error('User error:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Found user email:', user.email);

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    console.log('Stripe key available:', !!stripeSecretKey);
    
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });

    // Define success and cancel URLs
    const successUrl = Deno.env.get('PUBLIC_APP_URL') + '/payment-success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = Deno.env.get('PUBLIC_APP_URL') + '/payment-cancel';

    console.log('Creating checkout session with price ID:', priceId);
    
    // Create Stripe checkout session
    try {
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

      console.log('Checkout session created successfully:', session.id);
      
      // Return the session URL
      return new Response(
        JSON.stringify({ url: session.url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return new Response(
        JSON.stringify({ error: stripeError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 