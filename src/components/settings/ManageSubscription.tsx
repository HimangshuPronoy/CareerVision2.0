import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { PLANS, PRICES } from '@/lib/stripe';
import { format } from 'date-fns';

export function ManageSubscription() {
  const { subscription, refreshSubscription } = useSubscription();
  const { loading, createPortalSession, createCheckoutSession } = useStripeCheckout();

  const handleManageSubscription = async () => {
    if (subscription.isActive) {
      await createPortalSession();
    }
  };

  const handleUpgradeSubscription = async () => {
    if (subscription.plan === PLANS.FREE) {
      // Redirect to pricing page if not subscribed
      window.location.href = '/pricing';
    }
  };

  if (subscription.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Subscription
          {subscription.isActive && (
            <Badge variant={subscription.plan === PLANS.YEARLY ? 'default' : 'outline'}>
              {subscription.plan === PLANS.MONTHLY ? 'Monthly' : 'Yearly'}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Manage your subscription plan and billing
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscription.isActive ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Status</div>
              <div className="font-medium">
                {subscription.isActive ? 'Active' : 'Inactive'}
              </div>
              <div className="text-muted-foreground">Plan</div>
              <div className="font-medium capitalize">
                {subscription.plan === PLANS.MONTHLY ? 'Monthly' : 'Yearly'}
                {subscription.plan === PLANS.MONTHLY && 
                  ` ($${PRICES.MONTHLY}/month)`}
                {subscription.plan === PLANS.YEARLY && 
                  ` ($${PRICES.YEARLY}/year)`}
              </div>
              {subscription.currentPeriodEnd && (
                <>
                  <div className="text-muted-foreground">Current period ends</div>
                  <div className="font-medium">
                    {format(subscription.currentPeriodEnd, 'MMMM d, yyyy')}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              You are currently on the free plan with limited features.
              Upgrade to unlock all premium features.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {subscription.isActive ? (
          <Button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Manage Subscription'}
          </Button>
        ) : (
          <Button
            onClick={handleUpgradeSubscription}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Upgrade Plan'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ManageSubscription; 