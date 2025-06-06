import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { PRICE_IDS, PRICES, YEARLY_SAVINGS_PERCENTAGE } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { loading, createCheckoutSession } = useStripeCheckout();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    'Advanced AI career insights',
    'Detailed job market analysis',
    'Comprehensive skill assessments',
    'Unlimited resume builder',
    'Career path planning',
    'Industry-specific trends',
    'AI-powered skill recommendations',
    'Priority support',
    'Personalized 1-on-1 career coaching',
    'Advanced salary negotiation tools',
    'Executive resume review',
    'Interview preparation with AI',
    'LinkedIn profile optimization',
    'Early access to new features',
    'Dedicated account manager',
  ];

  const handleSubscribe = async (priceId: string) => {
    await createCheckoutSession(priceId);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Pricing Plans</span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the right plan to accelerate your career growth with data-driven insights and personalized recommendations.
          </p>

          <div className="flex items-center justify-center mt-8">
            <div className="relative flex rounded-full bg-muted p-1 mt-4">
              <button
                type="button"
                className={`relative flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition focus:outline-none ${
                  billingInterval === 'monthly' ? 'bg-background shadow' : ''
                }`}
                onClick={() => setBillingInterval('monthly')}
              >
                Monthly billing
              </button>
              <button
                type="button"
                className={`relative flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition focus:outline-none ${
                  billingInterval === 'yearly' ? 'bg-background shadow' : ''
                }`}
                onClick={() => setBillingInterval('yearly')}
              >
                <span>Annual billing</span>
                <Badge className="ml-2 bg-green-500 text-white">Save {YEARLY_SAVINGS_PERCENTAGE}%</Badge>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Pro Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <Badge className="rounded-bl-lg rounded-tr-lg px-3 py-1 bg-careervision-500 text-white">
                All Features Included
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>Advanced career insights for professionals</CardDescription>
              <div className="mt-1">
                <span className="text-4xl font-bold">
                  {billingInterval === 'monthly' 
                    ? `$${PRICES.MONTHLY}` 
                    : `$${PRICES.YEARLY}`}
                </span>
                <span className="text-muted-foreground">
                  {billingInterval === 'monthly' ? '/month' : '/year'}
                </span>
              </div>
              {billingInterval === 'yearly' && (
                <div className="text-sm text-green-500 mt-1">
                  ${PRICES.YEARLY_MONTHLY_EQUIVALENT}/month billed annually
                </div>
              )}
            </CardHeader>
            <CardContent className="pb-6">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {user ? (
                subscription.plan === (billingInterval === 'monthly' ? 'monthly' : 'yearly') ? (
                  <div className="text-center w-full">
                    <p className="text-sm text-muted-foreground mb-2">You are currently on this plan</p>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600"
                    onClick={() => handleSubscribe(
                      billingInterval === 'monthly' 
                        ? PRICE_IDS.MONTHLY 
                        : PRICE_IDS.YEARLY
                    )}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      subscription.isActive ? 'Change Plan' : 'Subscribe Now'
                    )}
                  </Button>
                )
              ) : (
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600"
                  asChild
                >
                  <Link to="/signup">Sign up and Subscribe</Link>
                </Button>
              )}
            </CardFooter>
          </Card>


        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            All plans include a 14-day money-back guarantee. Need a custom plan? 
            <a href="mailto:support@careervision.io" className="text-careervision-500 ml-1">Contact us</a>.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing; 