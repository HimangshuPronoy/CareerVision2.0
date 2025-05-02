import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PRICE_IDS } from '@/lib/stripe';
import { usePayment } from '@/contexts/PaymentContext';
import { supabase } from '@/integrations/supabase/client';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceId: string;
  features: PlanFeature[];
  buttonText: string;
  popular?: boolean;
  savings?: string;
}

const plans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Perfect for getting started',
    price: '$14.99',
    priceId: PRICE_IDS.MONTHLY,
    features: [
      { text: 'Resume builder', included: true },
      { text: 'Career path explorer', included: true },
      { text: 'Skills assessment', included: true },
      { text: 'AI recommendations', included: true },
      { text: 'Market trends insights', included: true },
      { text: 'Premium templates', included: true },
    ],
    buttonText: 'Subscribe Monthly',
  },
  {
    id: 'annual',
    name: 'Annual',
    description: 'Best value for serious career growth',
    price: '$129.99',
    priceId: PRICE_IDS.ANNUAL,
    features: [
      { text: 'Resume builder', included: true },
      { text: 'Career path explorer', included: true },
      { text: 'Skills assessment', included: true },
      { text: 'AI recommendations', included: true },
      { text: 'Market trends insights', included: true },
      { text: 'Premium templates', included: true },
    ],
    buttonText: 'Subscribe Yearly',
    popular: true,
    savings: 'Save 28%',
  },
];

export function PricingPlans() {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { createCheckoutSession, isSubscribed, subscriptionPlan } = usePayment();

  const handleSubscribe = async (priceId: string, planId: string) => {
    // If already subscribed to this plan, do nothing
    if (isSubscribed && subscriptionPlan === planId) {
      navigate('/dashboard');
      return;
    }

    console.log(`Subscribing to plan: ${planId} with priceId: ${priceId}`);
    
    try {
      setLoading(planId);
      
      // Log the user's authentication status
      const { data } = await supabase.auth.getUser();
      console.log('User authenticated:', !!data.user);
      
      const { url, error } = await createCheckoutSession(priceId);
      
      if (error) {
        console.error(`Error creating checkout session for ${planId}:`, error);
        alert(`Subscription error: ${error}`);
        return;
      }
      
      if (url) {
        console.log('Redirecting to checkout URL:', url);
        window.location.href = url;
      } else {
        console.error('No URL returned from checkout session');
        alert('Failed to create checkout session: No URL returned');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Subscription error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}
        >
          {plan.popular && (
            <div className="absolute top-0 right-0 rounded-bl-lg rounded-tr-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Best Value
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              {plan.price}
              <span className="ml-1 text-2xl font-medium text-muted-foreground">
                {plan.id === 'monthly' ? '/month' : '/year'}
              </span>
            </div>
            {plan.savings && (
              <div className="mt-1 text-sm font-medium text-green-600">
                {plan.savings}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check 
                    className={`mr-2 h-5 w-5 ${
                      feature.included ? 'text-green-500' : 'text-gray-300'
                    }`} 
                  />
                  <span className={feature.included ? '' : 'text-muted-foreground'}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
              onClick={() => handleSubscribe(plan.priceId, plan.id)}
              disabled={loading !== null}
            >
              {loading === plan.id ? 'Processing...' : 
                (isSubscribed && subscriptionPlan === plan.id) ? 'Current Plan' : plan.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 