import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const SubscriptionCancel: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 max-w-md">
        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Subscription Cancelled</CardTitle>
            <CardDescription>
              Your subscription process was not completed
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              The subscription process was cancelled or an error occurred during payment processing. Your account has not been charged.
            </p>
            <p className="text-sm text-muted-foreground">
              If you experienced any issues or have questions, please feel free to contact our support team.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600"
              asChild
            >
              <Link to="/pricing">Try Again</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="link" className="w-full" asChild>
              <a href="mailto:support@careervision.io">Contact Support</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SubscriptionCancel; 