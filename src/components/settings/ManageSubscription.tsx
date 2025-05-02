import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, ShieldCheck, CalendarClock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getUserId } from '@/lib/supabase';
import { cancelSubscription } from '@/lib/stripe';

const ManageSubscription: React.FC = () => {
  const { isSubscribed, plan, expiresAt, refreshSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Get the subscription ID
      const userId = await getUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Get the subscription ID from Supabase
      const response = await fetch('/api/get-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      const { subscriptionId } = await response.json();
      
      if (!subscriptionId) {
        throw new Error('No active subscription found');
      }
      
      // Cancel the subscription
      await cancelSubscription(subscriptionId);
      
      // Refresh the subscription state
      await refreshSubscription();
      
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled. You will still have access until the end of your billing period.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel your subscription. Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSubscribed) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-xl">Premium Features</CardTitle>
          <CardDescription>Upgrade to unlock all CareerVision features</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">Unlock Premium Benefits</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get access to advanced career insights, personalized recommendations, and more with a premium subscription.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate('/subscription')}
          >
            View Plans
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Subscription</CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-500">Active</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Current Plan</h3>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
              {plan}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            <span>
              Renews {expiresAt ? format(new Date(expiresAt), 'MMMM d, yyyy') : 'on your billing date'}
            </span>
          </div>
        </div>

        {plan === 'monthly' && (
          <div className="border rounded-md p-4 bg-muted/10">
            <div className="flex items-start space-x-2">
              <div className="bg-yellow-500/10 p-2 rounded-full">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Save with Yearly</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Switch to yearly billing and save 28%. That's over 3 months free!
                </p>
                <Button 
                  variant="link" 
                  className="h-8 p-0 text-yellow-600 hover:text-yellow-700 underline-offset-4"
                  onClick={() => navigate('/subscription')}
                >
                  Upgrade to yearly
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/subscription')}
        >
          Change Plan
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription? You'll continue to have access to premium features until the end of your current billing period.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCancelSubscription}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ManageSubscription; 