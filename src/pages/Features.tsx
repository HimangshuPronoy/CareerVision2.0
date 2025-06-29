
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your profile and market trends to provide personalized career insights.',
      benefits: ['Resume optimization', 'Skill gap analysis', 'Role recommendations']
    },
    {
      icon: Target,
      title: 'Career Path Planning',
      description: 'Visualize your career journey with interactive roadmaps and milestone tracking.',
      benefits: ['Goal setting', 'Progress tracking', 'Milestone rewards']
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Real-time job market data and predictive analytics to stay ahead of industry trends.',
      benefits: ['Salary insights', 'Demand forecasting', 'Industry analysis']
    },
    {
      icon: BookOpen,
      title: 'Learning Roadmaps',
      description: 'Personalized learning paths with curated courses and certifications.',
      benefits: ['Skill development', 'Course recommendations', 'Progress tracking']
    },
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect with mentors and peers in your industry for guidance and opportunities.',
      benefits: ['Mentor matching', 'Peer networking', 'Industry events']
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and private. Full GDPR compliance with transparent data usage.',
      benefits: ['Data encryption', 'Privacy controls', 'Secure authentication']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-gray-900 mb-6">
              Everything you need to
              <br />
              <span className="font-semibold">shape your future</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Thoughtfully designed features that work together seamlessly to accelerate your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-white rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                    <feature.icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
