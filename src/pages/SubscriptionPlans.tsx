import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import {
  BASIC_MONTHLY_PRICE,
  BASIC_YEARLY_PRICE,
  BASIC_YEARLY_SAVINGS_PERCENTAGE,
  STANDARD_MONTHLY_PRICE,
  STANDARD_YEARLY_PRICE,
  STANDARD_YEARLY_SAVINGS_PERCENTAGE,
  PRICE_IDS,
  LIFETIME_PRICE
} from '@/lib/stripe';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
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
  const basicFeatures = [
    'Basic skill assessments',
    'Basic career roadmaps',
    'Basic path recommendations',
    'Basic market insights',
    'Basic resume tools'
  ];

  const standardFeatures = [
    'Unlimited skill assessments',
    'Personalized career roadmaps',
    'Career path recommendations',
    'AI-driven market insights',
    'Advanced resume builder',
    'Skill gap analysis'
  ];

  const lifetimeFeatures = [
    'Unlimited skill assessments',
    'Personalized career roadmaps',
    'Career path recommendations',
    'AI-driven market insights',
    'Advanced resume builder',
    'Skill gap analysis',
    'Priority support',
    'Dedicated career coach',
    'Early feature access'
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-careervision-500 to-insight-500 bg-clip-text text-transparent">Upgrade Your Career Journey</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose a plan to unlock powerful AI-driven insights for your career.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-8 mb-12">
            <div className="inline-flex items-center p-1 bg-muted rounded-lg border border-border/50 shadow-sm">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-2 rounded-md font-medium transition ${billingInterval === 'monthly' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-4 py-2 rounded-md font-medium transition ${billingInterval === 'yearly' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground'}`}
              >
                Yearly <Badge className="ml-2">Save up to {STANDARD_YEARLY_SAVINGS_PERCENTAGE}%</Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className={`${subscription.isActive && (subscription.plan === 'basic_monthly' || subscription.plan === 'basic_yearly') ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'} shadow-md hover:shadow-lg transition-shadow duration-300`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-center">Basic Plan</CardTitle>
              <CardDescription className="text-center">Essential career tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold">${billingInterval === 'monthly' ? BASIC_MONTHLY_PRICE : BASIC_YEARLY_PRICE / 12}</span>
                <span className="text-muted-foreground">/month</span>
                {billingInterval === 'yearly' && (
                  <>
                    <p className="text-muted-foreground">Billed yearly (${BASIC_YEARLY_PRICE}/year)</p>
                    <p className="text-sm text-primary mt-1">Save ${BASIC_YEARLY_PRICE / 12 * 12 * (BASIC_YEARLY_SAVINGS_PERCENTAGE / 100)} per year</p>
                  </>
                )}
              </div>
              <ul className="space-y-2">
                {basicFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col items-center justify-center mt-6 space-y-4 sm:space-y-0 sm:flex-row sm:justify-center sm:gap-4">
                {subscription.isActive && (subscription.plan === 'basic_monthly' || subscription.plan === 'basic_yearly') ? (
                  <div className="px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-lg cursor-not-allowed opacity-75 w-48 text-center">
                    Current Plan
                  </div>
                ) : (
                  <Button
                    onClick={() => handleCheckout(billingInterval === 'monthly' ? PRICE_IDS.BASIC_MONTHLY : PRICE_IDS.BASIC_YEARLY)}
                    className="w-48 px-6 py-3 text-lg font-semibold transition-all duration-200 transform bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105 rounded-lg shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Get Basic'}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>

          {/* Standard Plan */}
          <Card className={`${subscription.isActive && (subscription.plan === 'standard_monthly' || subscription.plan === 'standard_yearly') ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'} shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-careervision-500 to-insight-500 text-white text-center py-1 text-sm font-medium">Most Popular</div>
            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-xl font-bold text-center">Standard Plan</CardTitle>
              <CardDescription className="text-center">Advanced career guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold">${billingInterval === 'monthly' ? STANDARD_MONTHLY_PRICE : STANDARD_YEARLY_PRICE / 12}</span>
                <span className="text-muted-foreground">/month</span>
                {billingInterval === 'yearly' && (
                  <>
                    <p className="text-muted-foreground">Billed yearly (${STANDARD_YEARLY_PRICE}/year)</p>
                    <p className="text-sm text-primary mt-1">Save ${STANDARD_YEARLY_PRICE / 12 * 12 * (STANDARD_YEARLY_SAVINGS_PERCENTAGE / 100)} per year</p>
                  </>
                )}
              </div>
              <ul className="space-y-2">
                {standardFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col items-center justify-center mt-6 space-y-4 sm:space-y-0 sm:flex-row sm:justify-center sm:gap-4">
                {subscription.isActive && (subscription.plan === 'standard_monthly' || subscription.plan === 'standard_yearly') ? (
                  <div className="px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-lg cursor-not-allowed opacity-75 w-48 text-center">
                    Current Plan
                  </div>
                ) : (
                  <Button
                    onClick={() => handleCheckout(billingInterval === 'monthly' ? PRICE_IDS.STANDARD_MONTHLY : PRICE_IDS.STANDARD_YEARLY)}
                    className="w-48 px-6 py-3 text-lg font-semibold transition-all duration-200 transform bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105 rounded-lg shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Get Standard'}
                  </Button>
                )}
              </div>
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
                <span className="text-3xl font-bold">${LIFETIME_PRICE}</span>
                <span className="text-muted-foreground">/one-time</span>
              </div>
              <ul className="space-y-2">
                {lifetimeFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col items-center justify-center mt-6 space-y-4 sm:space-y-0 sm:flex-row sm:justify-center sm:gap-4">
                {subscription.isActive && subscription.plan === 'lifetime' ? (
                  <div className="px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-lg cursor-not-allowed opacity-75 w-48 text-center">
                    Current Plan
                  </div>
                ) : (
                  <Button
                    onClick={() => handleCheckout(PRICE_IDS.LIFETIME)}
                    className="w-48 px-6 py-3 text-lg font-semibold transition-all duration-200 transform bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105 rounded-lg shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Get Lifetime Access'}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};