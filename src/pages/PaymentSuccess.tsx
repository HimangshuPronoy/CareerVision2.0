import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { checkSubscriptionStatus } = usePayment();

  useEffect(() => {
    // Refresh subscription status when the component mounts
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold">
          Payment Successful!
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Thank you for your subscription. Your payment has been processed successfully.
        </p>
        <p className="mt-2 text-muted-foreground">
          You now have access to all the features included in your plan.
        </p>
        <div className="mt-8 space-y-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/profile')}
          >
            View Your Profile
          </Button>
        </div>
      </div>
    </div>
  );
} 