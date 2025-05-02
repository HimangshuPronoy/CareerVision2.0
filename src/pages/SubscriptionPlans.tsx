import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_PRICES, createCheckoutSession, getStripe } from '@/lib/stripe';
import MainLayout from '@/components/layouts/MainLayout';

const SubscriptionPlans: React.FC = () => {
  const { user } = useAuth();
  const { isSubscribed, plan, refreshSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      navigate('/login?redirect=/subscription');
      return;
    }

    try {
      setIsLoading(planName);
      
      // Create a checkout session
      const { sessionId } = await createCheckoutSession(priceId, user.id);
      
      // Redirect to Stripe checkout
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });

    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Subscription Failed',
        description: 'There was an error processing your subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const features = [
    'Advanced Career Trend Analysis',
    'Personalized Skill Recommendations',
    'Detailed Industry Reports',
    'AI-powered Career Path Mapping',
    'Resume Optimization Tools',
    'Priority Support',
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-block rounded-full bg-careervision-100 dark:bg-careervision-900/20 px-3 py-1 text-sm font-medium text-careervision-800 dark:text-careervision-300">
            Premium
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Unlock Your <span className="gradient-text">Career Potential</span>
          </h1>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Choose the plan that fits your career goals and take your professional journey to the next level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <Card className="relative overflow-hidden border-2 hover:border-careervision-500 transition-all duration-300 shadow-lg">
            {plan === 'monthly' && (
              <div className="absolute top-0 right-0 mt-4 mr-4">
                <Badge variant="outline" className="bg-careervision-500 text-white border-careervision-500">
                  Current Plan
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Monthly Plan</CardTitle>
              <CardDescription>Billed monthly</CardDescription>
              <div className="mt-4 flex justify-center items-baseline">
                <span className="text-4xl font-extrabold">$14.99</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-careervision-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isSubscribed && plan === 'monthly' ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  disabled={isLoading !== null}
                  onClick={() => handleSubscribe(SUBSCRIPTION_PRICES.MONTHLY, 'monthly')}
                >
                  {isLoading === 'monthly' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Monthly'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card className="relative overflow-hidden border-2 hover:border-insight-500 transition-all duration-300 shadow-lg">
            {plan === 'yearly' && (
              <div className="absolute top-0 right-0 mt-4 mr-4">
                <Badge variant="outline" className="bg-careervision-500 text-white border-careervision-500">
                  Current Plan
                </Badge>
              </div>
            )}
            <div className="absolute top-0 left-0 mt-4 ml-4">
              <Badge variant="outline" className="bg-insight-500 text-white border-insight-500">
                Save 28%
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Yearly Plan</CardTitle>
              <CardDescription>Billed annually</CardDescription>
              <div className="mt-4 flex justify-center items-baseline">
                <span className="text-4xl font-extrabold">$129.99</span>
                <span className="text-muted-foreground ml-1">/year</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Equivalent to $10.83/month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-insight-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isSubscribed && plan === 'yearly' ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  disabled={isLoading !== null}
                  onClick={() => handleSubscribe(SUBSCRIPTION_PRICES.YEARLY, 'yearly')}
                >
                  {isLoading === 'yearly' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Yearly'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-muted rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Subscription Benefits</h3>
          <p className="text-muted-foreground mb-4">
            Your premium subscription unlocks the full potential of CareerVision, giving you data-driven insights 
            to make informed career decisions, track your professional growth, and stay ahead of industry trends.
          </p>
          <p className="text-sm text-muted-foreground">
            Need help? <a href="/contact" className="text-careervision-500 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubscriptionPlans; 