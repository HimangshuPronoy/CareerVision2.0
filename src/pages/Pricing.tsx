import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import {
  BASIC_MONTHLY_PRICE,
  STANDARD_MONTHLY_PRICE,
  LIFETIME_PRICE,
  PRICE_IDS,
} from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { loading, createCheckoutSession } = useStripeCheckout();

  const basicFeatures = [
    'Basic AI career insights',
    'Basic job market analysis',
    'Basic skill assessments',
    'Basic resume builder',
    'Basic career path planning'
  ];

  const standardFeatures = [
    'Advanced AI career insights',
    'Detailed job market analysis',
    'Comprehensive skill assessments',
    'Unlimited resume builder',
    'Career path planning',
    'Industry-specific trends',
    'AI-powered skill recommendations'
  ];

  const lifetimeFeatures = [
    'Advanced AI career insights',
    'Detailed job market analysis',
    'Comprehensive skill assessments',
    'Unlimited resume builder',
    'Career path planning',
    'Industry-specific trends',
    'AI-powered skill recommendations',
    'Priority support',
    'Early access to new features',
    'Dedicated account manager'
  ];

  const handleSubscribe = async (priceId: string) => {
    await createCheckoutSession(priceId);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-careervision-500 to-insight-500 bg-clip-text text-transparent">Pricing Plans</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan to unlock powerful AI-driven career insights.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className={`${subscription.isActive && subscription.plan === 'basic_monthly' ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'} shadow-md hover:shadow-lg transition-shadow duration-300`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-center">Basic Plan</CardTitle>
              <CardDescription className="text-center">Essential career tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold">${BASIC_MONTHLY_PRICE}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2">
                {basicFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600" 
                size="lg"
                disabled={loading}
                onClick={() => handleSubscribe(PRICE_IDS.BASIC_MONTHLY)}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? 'Loading...' : subscription.isActive && subscription.plan === 'basic_monthly' ? 'Manage Plan' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>

          {/* Standard Plan */}
          <Card className={`${subscription.isActive && subscription.plan === 'standard_monthly' ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'} shadow-md hover:shadow-lg transition-shadow duration-300 relative`}>
            <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-careervision-500 to-insight-500 text-white text-center py-1 text-sm font-medium">Most Popular</div>
            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-xl font-bold text-center">Standard Plan</CardTitle>
              <CardDescription className="text-center">Advanced career guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold">${STANDARD_MONTHLY_PRICE}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2">
                {standardFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600" 
                size="lg"
                disabled={loading}
                onClick={() => handleSubscribe(PRICE_IDS.STANDARD_MONTHLY)}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? 'Loading...' : subscription.isActive && subscription.plan === 'standard_monthly' ? 'Manage Plan' : 'Get Standard'}
              </Button>
            </CardFooter>
          </Card>

          {/* Lifetime Plan */}
          <Card className={`${subscription.isActive && subscription.plan === 'lifetime' ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'} shadow-md hover:shadow-lg transition-shadow duration-300`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-center">Lifetime Plan</CardTitle>
              <CardDescription className="text-center">Ultimate career support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-muted-foreground">/one-time</span>
              </div>
              <ul className="space-y-2">
                {lifetimeFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600" 
                size="lg"
                disabled={loading}
                onClick={() => handleSubscribe(PRICE_IDS.LIFETIME)}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? 'Loading...' : subscription.isActive && subscription.plan === 'lifetime' ? 'Manage Plan' : 'Get Lifetime Access'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;