import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/lib/stripe';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredPlans?: Array<'basic_monthly' | 'basic_yearly' | 'standard_monthly' | 'standard_yearly' | 'lifetime'>;
}

/**
 * A component that guards content based on subscription status.
 * If the user has an active subscription matching the required plans, it shows the children.
 * Otherwise, it shows the fallback content or a default upgrade prompt.
 */
export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  fallback,
  requiredPlans = [PLANS.BASIC_MONTHLY, PLANS.BASIC_YEARLY, PLANS.STANDARD_MONTHLY, PLANS.STANDARD_YEARLY, PLANS.LIFETIME],
}) => {
  const { subscription } = useSubscription();
  const navigate = useNavigate();

  const hasAccess = 
    subscription.isActive && 
    subscription.plan && 
    requiredPlans.includes(subscription.plan as 'basic_monthly' | 'basic_yearly' | 'standard_monthly' | 'standard_yearly' | 'lifetime');

  // Removed loading check as it doesn't exist on subscription object
  if (false) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-muted-foreground">Loading subscription status...</div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Default fallback if none is provided
  if (!fallback) {
    return (
      <div className="p-8 rounded-lg border border-border bg-muted/50 flex flex-col items-center justify-center text-center space-y-4">
        <h3 className="text-xl font-semibold">Premium Feature</h3>
        <p className="text-muted-foreground max-w-md">
          This feature is available exclusively to our premium subscribers.
          Upgrade your account to unlock all premium features.
        </p>
        <Button
          onClick={() => navigate('/pricing')}
          className="mt-4"
        >
          Upgrade Now
        </Button>
      </div>
    );
  }

  return <>{fallback}</>;
};

export default SubscriptionGuard; 