import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionSuccess: React.FC = () => {
  const { user } = useAuth();
  const { refreshSubscription, subscription } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [planType, setPlanType] = useState<string>('subscription');

  useEffect(() => {
    if (user) {
      // Refresh subscription status when the page loads
      refreshSubscription();
      
      // Get plan type from URL if available
      const params = new URLSearchParams(location.search);
      const plan = params.get('plan');
      if (plan) {
        setPlanType(plan === 'yearly' ? 'yearly' : 'monthly');
      } else if (subscription.plan) {
        setPlanType(subscription.plan);
      }
    } else {
      // If not authenticated, redirect to login
      navigate('/login', { replace: true });
    }
  }, [user, location]);

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 max-w-md">
        <Card className="border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
            <CardDescription>
              Thank you for subscribing to CareerVision {planType} plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Your {planType} subscription is now active. You now have access to all premium features of CareerVision.
            </p>
            <p className="text-sm text-gray-500">
              {subscription.currentPeriodEnd && (
                <span>Your subscription will renew on {subscription.currentPeriodEnd.toLocaleDateString()}.</span>
              )}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/settings">Manage Subscription</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SubscriptionSuccess; 