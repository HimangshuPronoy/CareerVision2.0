import { useState, useEffect } from 'react';
import { PricingPlans } from '@/components/pricing/PricingPlans';
import { usePayment } from '@/contexts/PaymentContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Function to directly test the Supabase function
async function testSupabaseFunction() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session found');
      return;
    }

    const SUPABASE_URL = "https://lxnmvvldfjmpoqsdhaug.supabase.co";
    
    console.log('Testing Supabase function...');
    const response = await fetch(`${SUPABASE_URL}/functions/v1/bright-handler?userId=${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      }
    });
    
    console.log('Response status:', response.status);
    const responseBody = await response.text();
    console.log('Response body:', responseBody);
    
    try {
      const jsonData = JSON.parse(responseBody);
      console.log('Parsed JSON:', jsonData);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

export default function Pricing() {
  const { checkSubscriptionStatus, isLoading, error: paymentError } = usePayment();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Checking subscription status...');
        await checkSubscriptionStatus();
        console.log('Subscription status checked successfully');
      } catch (err) {
        console.error('Error checking subscription status:', err);
        setError('Failed to load subscription data');
      } finally {
        setPageLoading(false);
      }
    };

    // Set a timeout to ensure we don't wait forever
    const timeoutId = setTimeout(() => {
      setPageLoading(false);
    }, 5000);

    loadData();

    return () => clearTimeout(timeoutId);
  }, [checkSubscriptionStatus]);

  if (pageLoading && isLoading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p>Loading pricing information...</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => {
            setPageLoading(false);
            testSupabaseFunction();
          }}
        >
          Skip Loading &amp; Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {(error || paymentError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error || paymentError}
            {" "}You can still view pricing information, but some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Pricing Plans
        </h2>
        <p className="mt-3 text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your career goals
        </p>
      </div>
      
      <div className="mt-12">
        <PricingPlans />
      </div>
      
      <div className="mt-16 max-w-2xl mx-auto text-center">
        <h3 className="text-lg font-medium">
          Frequently Asked Questions
        </h3>
        <div className="mt-6">
          <div className="space-y-8">
            <div>
              <h4 className="text-base font-semibold">Can I cancel my subscription at any time?</h4>
              <p className="mt-2 text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold">Is there a free trial?</h4>
              <p className="mt-2 text-muted-foreground">
                We don't currently offer a free trial, but we do offer a Basic plan with essential features to get you started.
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold">Can I switch between plans?</h4>
              <p className="mt-2 text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes to your plan will take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold">How secure is my payment information?</h4>
              <p className="mt-2 text-muted-foreground">
                All payments are processed securely through Stripe. We never store your credit card information on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 