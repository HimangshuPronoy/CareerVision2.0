import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { 
  BarChart, 
  BriefcaseBusiness, 
  GraduationCap, 
  LineChart, 
  Target, 
  TrendingUp,
  Sparkles,
  Compass,
  CheckCircle,
  Brain,
  Briefcase,
  FileText,
  MessageSquare,
  Zap,
  Award,
  Users,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Features = () => {
  const coreFeatures = [
    {
      icon: <TrendingUp className="h-10 w-10 p-2 bg-careervision-100 text-careervision-500 rounded-2xl" />,
      title: "Market Trend Analysis",
      description: "Real-time insights into job market trends, demand forecasts, and industry growth rates."
    },
    {
      icon: <CheckCircle className="h-10 w-10 p-2 bg-insight-100 text-insight-500 rounded-2xl" />,
      title: "Skill Gap Assessment",
      description: "Identify gaps between your current skills and market demands to strategically upskill."
    },
    {
      icon: <Compass className="h-10 w-10 p-2 bg-careervision-100 text-careervision-500 rounded-2xl" />,
      title: "Career Path Mapping",
      description: "Visualize potential career trajectories based on your experience and market opportunities."
    },
    {
      icon: <BriefcaseBusiness className="h-10 w-10 p-2 bg-insight-100 text-insight-500 rounded-2xl" />,
      title: "Industry Insights",
      description: "Deep dives into industry-specific trends, emerging roles, and projected growth."
    },
    {
      icon: <GraduationCap className="h-10 w-10 p-2 bg-careervision-100 text-careervision-500 rounded-2xl" />,
      title: "Learning Resources",
      description: "Curated recommendations for courses, certifications, and resources to build in-demand skills."
    },
    {
      icon: <Sparkles className="h-10 w-10 p-2 bg-insight-100 text-insight-500 rounded-2xl" />,
      title: "AI-Powered Recommendations",
      description: "Personalized suggestions for career moves and skill development based on your profile."
    }
  ];

  const aiFeatures = [
    {
      icon: <Brain className="h-10 w-10 p-2 bg-purple-100 text-purple-500 rounded-2xl" />,
      title: "Gemini 2.0 Flash AI Engine",
      description: "Powered by Google's advanced AI model to provide intelligent career insights and recommendations."
    },
    {
      icon: <Target className="h-10 w-10 p-2 bg-blue-100 text-blue-500 rounded-2xl" />,
      title: "Personalized Career Matching",
      description: "AI algorithms match your skills and experience with ideal career paths with accuracy scores."
    },
    {
      icon: <LineChart className="h-10 w-10 p-2 bg-green-100 text-green-500 rounded-2xl" />,
      title: "Skill Growth Forecasting",
      description: "Predictive analytics to show which skills will grow in demand in your industry over time."
    },
    {
      icon: <Zap className="h-10 w-10 p-2 bg-yellow-100 text-yellow-500 rounded-2xl" />,
      title: "Real-time Market Analysis",
      description: "Up-to-date insights on job market trends, salary ranges, and hiring companies."
    }
  ];

  const premiumFeatures = [
    {
      icon: <MessageSquare className="h-10 w-10 p-2 bg-amber-100 text-amber-500 rounded-2xl" />,
      title: "1-on-1 Career Coaching",
      description: "Personal coaching sessions with industry experts to guide your career development."
    },
    {
      icon: <FileText className="h-10 w-10 p-2 bg-pink-100 text-pink-500 rounded-2xl" />,
      title: "Executive Resume Review",
      description: "Professional review and optimization of your resume by industry specialists."
    },
    {
      icon: <Briefcase className="h-10 w-10 p-2 bg-indigo-100 text-indigo-500 rounded-2xl" />,
      title: "Interview Preparation",
      description: "AI-powered mock interviews and personalized feedback to improve your performance."
    },
    {
      icon: <Award className="h-10 w-10 p-2 bg-red-100 text-red-500 rounded-2xl" />,
      title: "Early Access Program",
      description: "Be the first to try new features and provide feedback to shape the platform."
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
              Features
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Accelerate Your Career with <span className="gradient-text">AI-Powered Insights</span>
            </h1>
            <p className="max-w-[800px] text-xl text-muted-foreground">
              Discover how CareerVision's cutting-edge features can transform your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600" asChild>
                <Link to="/pricing">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Try Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
              Core Platform
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Data-Driven <span className="gradient-text">Career Intelligence</span>
            </h2>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Leverage the power of data analytics and machine learning to make informed career decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {coreFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="relative group rounded-3xl p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-careervision-200 dark:hover:border-gray-700 h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-careervision-500/5 to-insight-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Features Section */}
      <div className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
              Pro Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
              <span className="gradient-text">AI-Powered</span> Career Insights
            </h2>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Unlock advanced AI features with our Pro subscription to supercharge your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {aiFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="relative group rounded-3xl p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-careervision-200 dark:hover:border-gray-700 h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-careervision-500/5 to-insight-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-careervision-500 text-white">Pro</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="py-24 bg-gradient-to-b from-background to-amber-50/30 dark:to-amber-950/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <div className="inline-block rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300">
              Premium Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Premium</span> Career Acceleration
            </h2>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Experience white-glove service with our Premium plan for professionals serious about career advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {premiumFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="relative group rounded-3xl p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800/30 h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-700/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-amber-500 text-white">Premium</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-b from-amber-50/30 dark:from-amber-950/10 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-careervision-500 to-insight-500 p-8 md:p-12">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl">
                  Join thousands of professionals who are leveraging AI-powered insights to make smarter career decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-careervision-600 hover:bg-white/90" asChild>
                    <Link to="/pricing">View Pricing Plans</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                    <Link to="/signup">Create Free Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Features;
