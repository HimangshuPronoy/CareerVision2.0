
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import AppPreview from './AppPreview';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-50 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="text-left lg:text-left">
            {/* Badge */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Career Intelligence</span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-8 tracking-tight">
              Your career,
              <br />
              <span className="font-semibold">reimagined</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
              Discover your potential with AI-driven insights, personalized learning paths, 
              and predictive career intelligence. The future of work starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-medium">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 rounded-full text-lg font-medium border-gray-300 hover:bg-gray-50">
                Watch Demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10,000+ professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live market data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>AI-powered insights</span>
              </div>
            </div>
          </div>

          {/* Right side - App Preview */}
          <div className="lg:block">
            <AppPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
