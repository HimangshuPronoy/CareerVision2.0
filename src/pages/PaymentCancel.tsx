import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold">
          Payment Cancelled
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Your payment process was cancelled and no charges were made.
        </p>
        <p className="mt-2 text-muted-foreground">
          If you have any questions or encountered any issues, please don't hesitate to contact our support team.
        </p>
        <div className="mt-8 space-y-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/pricing')}
          >
            Back to Pricing
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
} 