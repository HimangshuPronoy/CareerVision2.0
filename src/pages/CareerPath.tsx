
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, MapPin, Target, Clock, Star, Zap, Sparkles, Award } from 'lucide-react';

const CareerPath = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [targetCareer, setTargetCareer] = useState('');
  const [careerPath, setCareerPath] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedPaths, setSavedPaths] = useState<any[]>([]);

  const generateCareerPath = async () => {
    if (!targetCareer.trim()) {
      toast({
        title: 'Career Required',
        description: 'Please enter a target career or job title.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate career path generation for now
      const mockPath = {
        steps: [
          {
            title: 'Build Foundation Skills',
            description: `Start with fundamental skills needed for ${targetCareer}`,
            timeframe: '3-6 months',
            skills: ['Problem Solving', 'Communication', 'Technical Basics']
          },
          {
            title: 'Gain Practical Experience',
            description: 'Apply your skills through projects and internships',
            timeframe: '6-12 months',
            skills: ['Project Management', 'Industry Knowledge', 'Networking']
          },
          {
            title: 'Advance Your Expertise',
            description: 'Develop specialized skills and leadership abilities',
            timeframe: '1-2 years',
            skills: ['Leadership', 'Strategic Thinking', 'Advanced Technical Skills']
          }
        ],
        keySkills: ['Communication', 'Problem Solving', 'Leadership', 'Technical Expertise'],
        recommendations: `To become a successful ${targetCareer}, focus on building both technical and soft skills. Start with foundational knowledge and gradually advance to specialized expertise.`
      };

      setTimeout(() => {
        setCareerPath(mockPath);
        setLoading(false);
        toast({
          title: 'Career Path Generated!',
          description: 'Your personalized career roadmap is ready.',
        });
      }, 2000);
    } catch (error) {
      console.error('Error generating career path:', error);
      toast({
        title: 'Generation Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Career Path Generator</h1>
                  <p className="text-emerald-100 text-lg">Discover your personalized roadmap to career success</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    AI Roadmap
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Target className="w-4 h-4 mr-1" />
                    Goal Oriented
                  </Badge>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900">
                  <Target className="w-6 h-6 mr-2 text-emerald-600" />
                  Generate Your Career Path
                </CardTitle>
                <p className="text-gray-600">Enter your target career to get a personalized roadmap</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex space-x-4">
                  <Input
                    placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generateCareerPath()}
                    className="flex-1 border-2 border-gray-200 focus:border-emerald-500 rounded-xl h-12 text-lg"
                  />
                  <Button
                    onClick={generateCareerPath}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Path
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Career Path Results */}
            {careerPath && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-gray-900">
                    <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                    Your Career Path: {targetCareer}
                  </CardTitle>
                  <p className="text-gray-600">AI-generated roadmap to achieve your career goals</p>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Career Steps */}
                  {careerPath.steps && careerPath.steps.length > 0 && (
                    <div className="space-y-6 mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                        Career Steps
                      </h3>
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500"></div>
                        <div className="space-y-8">
                          {careerPath.steps.map((step: any, index: number) => (
                            <div key={index} className="relative flex items-start space-x-6">
                              <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                                {index + 1}
                              </div>
                              <div className="flex-1 bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                                  {step.timeframe && (
                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {step.timeframe}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-700 mb-4">{step.description}</p>
                                {step.skills && (
                                  <div className="flex flex-wrap gap-2">
                                    {step.skills.map((skill: string, skillIndex: number) => (
                                      <Badge key={skillIndex} variant="secondary" className="bg-blue-100 text-blue-800">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Skills */}
                  {careerPath.keySkills && careerPath.keySkills.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-600" />
                        Key Skills to Develop
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {careerPath.keySkills.map((skill: string, index: number) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
                            <p className="font-medium text-yellow-800">{skill}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {careerPath.recommendations && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-purple-600" />
                        Recommendations
                      </h3>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                        <p className="text-gray-800 leading-relaxed">{careerPath.recommendations}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CareerPath;
