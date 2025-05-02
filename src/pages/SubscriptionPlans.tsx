import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { PRICE_IDS, PRICES, YEARLY_SAVINGS, YEARLY_SAVINGS_PERCENTAGE } from '@/lib/stripe';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function SubscriptionPlans() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const { subscription } = useSubscription();
  const { createCheckoutSession, loading } = useStripeCheckout();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await createCheckoutSession(priceId);
  };

  // Plan features
  const features = [
    'Unlimited skill assessments',
    'Personalized career roadmaps',
    'Career path recommendations',
    'Detailed job market analytics',
    'AI-powered skill gap analysis',
    'Resume optimization tools',
    'Customized learning resources',
    'Job application tracking',
  ];

  return (
    <div className="container max-w-5xl py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Invest in your career development with a premium plan that unlocks powerful tools and insights to help you achieve your professional goals.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs
          defaultValue="monthly"
          value={billingInterval}
          onValueChange={(value) => setBillingInterval(value as 'monthly' | 'yearly')}
          className="w-full max-w-md"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="outline" className="ml-2 bg-primary/10">
                Save {YEARLY_SAVINGS_PERCENTAGE}%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>Basic features to explore the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-3xl font-bold">$0</p>
              <p className="text-muted-foreground">Forever free</p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>Limited skill assessments</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>Basic career recommendations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>Basic job market insights</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full"
              disabled={loading}
            >
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="border-primary/50 shadow-md relative">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <Badge className="bg-primary text-primary-foreground">
              Recommended
            </Badge>
          </div>
          <CardHeader>
            <CardTitle>Premium Plan</CardTitle>
            <CardDescription>Full access to all features and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              {billingInterval === 'monthly' ? (
                <>
                  <p className="text-3xl font-bold">${PRICES.MONTHLY} <span className="text-base font-normal text-muted-foreground">/month</span></p>
                  <p className="text-muted-foreground">Billed monthly</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold">${PRICES.YEARLY} <span className="text-base font-normal text-muted-foreground">/year</span></p>
                  <p className="text-muted-foreground">Billed yearly (${PRICES.YEARLY_MONTHLY_EQUIVALENT}/month)</p>
                  <p className="text-sm text-primary mt-1">Save ${YEARLY_SAVINGS} per year</p>
                </>
              )}
            </div>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleCheckout(
                billingInterval === 'monthly' ? PRICE_IDS.MONTHLY : PRICE_IDS.YEARLY
              )}
              className="w-full"
              disabled={loading || (subscription.isActive && subscription.plan === billingInterval)}
            >
              {loading ? 'Processing...' : 
               (subscription.isActive && subscription.plan === billingInterval) ? 'Current Plan' : 
               subscription.isActive ? 'Change Plan' : 'Get Started'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10 text-center text-sm text-muted-foreground">
        <p>
          All plans include a 14-day money-back guarantee. No questions asked.
          <br />
          Need help choosing? <a href="/contact" className="text-primary hover:underline">Contact us</a>.
        </p>
      </div>
    </div>
  );
} 