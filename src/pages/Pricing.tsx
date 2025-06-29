import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for exploring your career options',
      features: [
        'Basic resume analysis',
        'Job market insights',
        'Career path visualization',
        'Community access',
        'Mobile app access'
      ],
      cta: 'Get Started',
      popular: false,
      priceId: null
    },
    {
      name: 'Basic',
      price: '$14.99',
      period: '/month',
      description: 'For job seekers getting started',
      features: [
        'AI job scraping (50 jobs/month)',
        'Basic skill analysis',
        'Job match scoring',
        'Email alerts',
        'Resume templates',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: false,
      priceId: 'price_1RJumRJjRarA6eH84kygqd80'
    },
    {
      name: 'Standard',
      price: '$17.99',
      period: '/month',
      description: 'For serious career advancement',
      features: [
        'Unlimited AI job scraping',
        'Advanced skill analysis',
        'Personalized learning paths',
        'Premium job insights',
        'Career coaching',
        'Export capabilities',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: true,
      priceId: 'price_1RZqBRJjRarA6eH8MQhkccmL'
    },
    {
      name: 'Lifetime',
      price: '$99.99',
      period: 'one-time',
      description: 'One-time payment for lifetime access',
      features: [
        'Everything in Standard',
        'Lifetime access to all features',
        'Future updates included',
        'Dedicated support',
        'Advanced security',
        'Exclusive content',
        'Early access to new features'
      ],
      cta: 'Buy Now',
      popular: false,
      priceId: 'price_1RZqDvJjRarA6eH8BJsvfBqf'
    }
  ];

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
              Choose the plan that fits your career goals. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative bg-white rounded-3xl border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${
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
                    <span className="text-4xl font-light text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
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
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-gray-400">
              Questions? <a href="#" className="text-gray-900 hover:underline">Contact our team</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
