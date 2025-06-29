
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Users, 
  BarChart3
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Resume Analysis',
      description: 'Advanced machine learning algorithms analyze your resume and provide personalized recommendations for skill development and job matching.',
    },
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Real-time job market data and predictive analytics help you understand industry trends and salary expectations.',
    },
    {
      icon: Target,
      title: 'Career Path Planning',
      description: 'Visualize your career journey with interactive roadmaps and milestone tracking tailored to your goals.',
    },
    {
      icon: BookOpen,
      title: 'Learning Roadmaps',
      description: 'Personalized learning paths with curated courses and certifications to advance your skills strategically.',
    },
    {
      icon: TrendingUp,
      title: 'Success Prediction',
      description: 'Data-driven insights into your readiness for target roles using predictive modeling and industry benchmarks.',
    },
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect with mentors and peers in your industry for guidance, networking, and career opportunities.',
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Everything you need to
            <br />
            <span className="font-semibold">accelerate your career</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thoughtfully designed features that work together seamlessly to provide 
            comprehensive career intelligence and guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group bg-white rounded-3xl border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
