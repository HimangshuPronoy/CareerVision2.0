import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { createCheckoutSession } from '@/services/stripe';
import { useSubscription } from '@/hooks/useSubscription';
import { PRICING_PLANS } from '@/config/pricing';

export const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, loading, isSubscribed } = useSubscription();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe to a plan.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      await createCheckoutSession(priceId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getButtonText = (priceId: string) => {
    if (loading) return 'Loading...';
    if (isSubscribed()) return 'Current Plan';
    return 'Subscribe';
  };

  const isCurrentPlan = (priceId: string) => {
    return subscription?.stripe_price_id === priceId;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => (
            <Card
              key={key}
              className={`relative ${
                plan.interval === 'year' ? 'border-primary shadow-lg' : ''
              }`}
            >
              {plan.interval === 'year' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                    Best Value
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.interval === 'year' ? 'Save 20% with yearly billing' : 'Flexible monthly billing'}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrentPlan(plan.priceId) ? 'secondary' : 'default'}
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading || isCurrentPlan(plan.priceId)}
                >
                  {getButtonText(plan.priceId)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}; 