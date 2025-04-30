import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: string;
  plan_type: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (subscriptionData: Partial<Subscription>) => {
    if (!user || !subscription) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', subscription.id);

      if (error) throw error;

      await fetchSubscription();
      toast({
        title: 'Success',
        description: 'Subscription updated successfully.',
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const cancelSubscription = async () => {
    if (!user || !subscription) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);

      if (error) throw error;

      await fetchSubscription();
      toast({
        title: 'Success',
        description: 'Subscription will be canceled at the end of the billing period.',
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isSubscribed = () => {
    return subscription?.status === 'active' && !subscription?.cancel_at_period_end;
  };

  const isPro = () => {
    return isSubscribed() && subscription?.plan_type === 'pro';
  };

  const isEnterprise = () => {
    return isSubscribed() && subscription?.plan_type === 'enterprise';
  };

  return {
    subscription,
    loading,
    error,
    updateSubscription,
    cancelSubscription,
    isSubscribed,
    isPro,
    isEnterprise,
    refreshSubscription: fetchSubscription,
  };
}; 