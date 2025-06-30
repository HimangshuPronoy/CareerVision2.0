import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Define plan type with all necessary properties
type Plan = {
  name: string;
  priceUSD: string;
  priceEUR: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  priceIdUSD?: string;
  priceIdEUR?: string;
};

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userCurrency, setUserCurrency] = useState<'USD' | 'EUR'>('USD');
  const [userCountry, setUserCountry] = useState<string>('');

  useEffect(() => {
    // Fetch user's location to determine currency
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      // Use a more reliable and privacy-friendly approach if possible
      const response = await fetch('https://ipapi.co/json/', {
        headers: {
          'User-Agent': 'CareerVision/1.0'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const country = data.country_name || 'Unknown';
      setUserCountry(country);
      
      // List of countries that should see USD
      const usdCountries = ['United States', 'Canada', 'Australia', 'Singapore'];
      // Check if user's country is in USD list
      const currency = usdCountries.includes(country) ? 'USD' : 'EUR';
      setUserCurrency(currency);
    } catch (error) {
      console.error('Error fetching location:', error);
      // Default to EUR if location fetch fails as it's more common globally
      setUserCurrency('EUR');
      setUserCountry('Unknown');
    }
  };

  const plans: Plan[] = [
    {
      name: 'Basic',
      priceUSD: '$14.99',
      priceEUR: '€13.20',
      period: '/month',
      description: 'For job seekers getting started',
      features: [
        'AI job scraping (50 jobs/month)',
        'Advanced resume optimization',
        'Personalized career recommendations',
        'Skill gap analysis',
        'Email support'
      ],
      cta: 'Buy Now',
      popular: false,
      priceIdUSD: 'price_1RffMeJjRarA6eH8L8ftDxsQ',
      priceIdEUR: 'price_1RffMeJjRarA6eH8L8ftDxsQ'
    },
    {
      name: 'Standard',
      priceUSD: '$17.99',
      priceEUR: '€16.20',
      period: '/month',
      description: 'For professionals accelerating their career',
      features: [
        'Unlimited AI job scraping',
        'Real-time market intelligence',
        'AI-powered networking',
        'Interview coaching',
        'Priority support'
      ],
      cta: 'Buy Now',
      popular: true,
      priceIdUSD: 'price_1RffM6JjRarA6eH8ndFtyolX',
      priceIdEUR: 'price_1RffM6JjRarA6eH8ndFtyolX'
    },
    {
      name: 'Lifetime',
      priceUSD: '$109.99',
      priceEUR: '€99.99',
      period: '/one-time',
      description: 'One-time payment for lifetime access',
      features: [
        'Everything in Standard',
        'Lifetime access to all features',
        'Future updates included',
        'Premium community access',
        'Dedicated support'
      ],
      cta: 'Buy Now',
      popular: false,
      priceIdUSD: 'price_1RffMwJjRarA6eH8Zr05ETrw',
      priceIdEUR: 'price_1RffMwJjRarA6eH8Zr05ETrw'
    }
  ];

  const handleCheckout = async (plan: Plan) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const priceId = userCurrency === 'USD' ? plan.priceIdUSD : plan.priceIdEUR;
      if (!priceId) throw new Error('No price ID available');

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, plan: plan.name }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-gray-900 mb-6">
              Simple, transparent
              <br />
              <span className="font-semibold">pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your career goals. Prices shown in {userCurrency === 'USD' ? 'USD' : 'EUR'} based on your location{userCountry && userCountry !== 'Unknown' ? ` (${userCountry})` : ''}. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative bg-white rounded-3xl border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-gray-900 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gray-900 text-white px-4 py-1 rounded-full">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-light text-gray-900">{userCurrency === 'USD' ? plan.priceUSD : plan.priceEUR}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleCheckout(plan)}
                    disabled={loading}
                    className={`w-full rounded-full py-3 ${
                      plan.popular 
                        ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-500 mb-4">
              Start using CareerVision today. No trial period.
            </p>
            <p className="text-sm text-gray-400">
              Questions? <a href="mailto:support@careervision.com" className="text-gray-900 hover:underline">Contact our team</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
