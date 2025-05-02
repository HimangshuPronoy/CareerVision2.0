import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectToSubscription?: boolean;
}

/**
 * A component that restricts access to premium features based on subscription status.
 * If the user is subscribed, it renders the children.
 * If not, it either redirects to the subscription page or renders a fallback UI.
 */
const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  fallback,
  redirectToSubscription = false,
}) => {
  const { isSubscribed, isLoading } = useSubscription();

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse">
          <ShieldCheck className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
    );
  }

  // If subscribed, show the protected content
  if (isSubscribed) {
    return <>{children}</>;
  }

  // If not subscribed and redirect is enabled, redirect to subscription page
  if (redirectToSubscription) {
    return <Navigate to="/subscription" />;
  }

  // If not subscribed and a fallback is provided, render that
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback UI
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-careervision-500" />
          Premium Feature
        </CardTitle>
        <CardDescription>
          This feature requires a premium subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to a premium plan to unlock all features and take your career to the next level.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a href="/subscription">
            View Plans <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionGuard; 