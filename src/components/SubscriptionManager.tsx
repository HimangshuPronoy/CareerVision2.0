
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Crown, Zap, RefreshCw, Settings } from 'lucide-react';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

const SubscriptionManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false
  });

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to check subscription status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (priceId: string, plan: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, plan }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      // Open Stripe customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: 'Error',
        description: 'Failed to open customer portal',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for exploring career options',
      features: [
        'Basic resume analysis',
        'Limited job market insights',
        'Career path visualization',
        'Community access'
      ],
      priceId: null,
      current: !subscriptionStatus.subscribed
    },
    {
      name: 'Basic',
      price: '$14.99',
      period: '/month',
      description: 'For job seekers getting started',
      features: [
        'AI job scraping (50 jobs/month)',
        'Basic skill analysis',
        'Job match scoring',
        'Email alerts',
        'Resume templates',
        'Priority support'
      ],
      priceId: 'price_1RJumRJjRarA6eH84kygqd80',
      current: subscriptionStatus.subscribed && subscriptionStatus.subscription_tier === 'Basic'
    },
    {
      name: 'Standard',
      price: '$17.99',
      period: '/month',
      description: 'For serious career advancement',
      features: [
        'Unlimited AI job scraping',
        'Advanced skill analysis',
        'Personalized learning paths',
        'Premium job insights',
        'Career coaching',
        'Export capabilities',
        'API access'
      ],
      priceId: 'price_1RZqBRJjRarA6eH8MQhkccmL',
      current: subscriptionStatus.subscribed && subscriptionStatus.subscription_tier === 'Standard'
    },
    {
      name: 'Lifetime',
      price: '$99.99',
      period: ' one-time',
      description: 'All features forever',
      features: [
        'Everything in Standard',
        'Lifetime access',
        'All future features',
        'Premium community access',
        'Direct developer support',
        'No recurring payments',
        'Best value'
      ],
      priceId: 'price_1RZqDvJjRarA6eH8BJsvfBqf',
      current: subscriptionStatus.subscribed && subscriptionStatus.subscription_tier === 'Lifetime'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600">Choose the plan that fits your career goals</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={checkSubscription}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          {subscriptionStatus.subscribed && (
            <Button 
              onClick={handleManageSubscription}
              variant="outline"
              disabled={loading}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          )}
        </div>
      </div>

      {subscriptionStatus.subscribed && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Active Subscription: {subscriptionStatus.subscription_tier}
                </h3>
                {subscriptionStatus.subscription_end && (
                  <p className="text-green-600">
                    {subscriptionStatus.subscription_tier === 'Lifetime' 
                      ? 'Lifetime access - no expiration' 
                      : `Renews on ${new Date(subscriptionStatus.subscription_end).toLocaleDateString()}`
                    }
                  </p>
                )}
              </div>
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative ${
              plan.current 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-lg transition-shadow'
            } ${plan.name === 'Lifetime' ? 'border-2 border-yellow-400' : ''}`}
          >
            {plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">
                  Current Plan
                </Badge>
              </div>
            )}
            
            {plan.name === 'Lifetime' && !plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-white">
                  Best Value
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {plan.name === 'Basic' && <Sparkles className="w-5 h-5 text-purple-500" />}
                {plan.name === 'Standard' && <Zap className="w-5 h-5 text-orange-500" />}
                {plan.name === 'Lifetime' && <Crown className="w-5 h-5 text-yellow-500" />}
                {plan.name}
              </CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                {plan.price}
                <span className="text-lg font-normal text-gray-500">{plan.period}</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {plan.priceId ? (
                <Button 
                  onClick={() => handleCheckout(plan.priceId!, plan.name)}
                  disabled={loading || plan.current}
                  className="w-full"
                  variant={plan.current ? "outline" : "default"}
                >
                  {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Free Plan'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManager;
