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

// Updated CORS headers to allow requests from localhost
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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
    // Get user ID from query params
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query subscriptions table
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !subscription) {
      return new Response(
        JSON.stringify({ isActive: false, plan: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });

    // Get subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
    const isActive = stripeSubscription.status === 'active';
    
    // Get the price ID to determine the plan
    const priceId = stripeSubscription.items.data[0].price.id;
    let plan = 'none';
    
    if (priceId === Deno.env.get('VITE_STRIPE_PRICE_MONTHLY')) {
      plan = 'monthly';
    } else if (priceId === Deno.env.get('VITE_STRIPE_PRICE_ANNUAL')) {
      plan = 'annual';
    }

    // Return subscription status
    return new Response(
      JSON.stringify({ isActive, plan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 