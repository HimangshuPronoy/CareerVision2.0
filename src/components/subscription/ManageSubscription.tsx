import React from 'react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, CreditCard } from 'lucide-react';

export function ManageSubscription() {
  const { redirectToCustomerPortal, isLoading, isSubscribed, subscriptionPlan } = usePayment();

  const handleManageSubscription = async () => {
    await redirectToCustomerPortal();
  };

  if (!isSubscribed) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-careervision-500">
          <CreditCard className="h-5 w-5" />
          <span className="font-medium">
            {subscriptionPlan === 'monthly' ? 'Monthly Plan' : 'Annual Plan'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Manage your billing information, payment methods, and subscription details.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Manage Subscription'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 