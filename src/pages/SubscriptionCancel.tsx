import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function SubscriptionCancel() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-md py-20">
      <div className="text-center space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">
          Subscription Cancelled
        </h1>
        
        <p className="text-muted-foreground">
          Your subscription process was cancelled. No charges have been made.
          You can still use the free features of the platform.
        </p>
        
        <div className="flex flex-col space-y-3 pt-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/pricing')}
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
} 