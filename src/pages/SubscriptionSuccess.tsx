import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PLANS } from '@/lib/stripe';

export default function SubscriptionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSubscription, subscription } = useSubscription();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');
  const plan = params.get('plan') as 'monthly' | 'yearly' || null;

  useEffect(() => {
    // Refresh subscription status when this page loads
    refreshSubscription();
  }, []);

  const getPlanText = () => {
    if (plan === PLANS.MONTHLY) return 'Monthly';
    if (plan === PLANS.YEARLY) return 'Yearly';
    if (subscription.plan === PLANS.MONTHLY) return 'Monthly';
    if (subscription.plan === PLANS.YEARLY) return 'Yearly';
    return 'Premium';
  };

  return (
    <div className="container max-w-md py-20">
      <div className="text-center space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">
          Subscription Successful!
        </h1>
        
        <p className="text-muted-foreground">
          You're now subscribed to the {getPlanText()} plan. Thank you for upgrading!
          All premium features have been unlocked for your account.
        </p>
        
        <div className="flex flex-col space-y-3 pt-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/settings')}
          >
            Manage Subscription
          </Button>
        </div>
      </div>
    </div>
  );
} 