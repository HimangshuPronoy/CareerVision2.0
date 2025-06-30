
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Target, Clock, CheckCircle, PlayCircle, Zap, Sparkles, Award, Star } from 'lucide-react';

const LearningPath = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [targetSkill, setTargetSkill] = useState('');
  const [learningPath, setLearningPath] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedPaths, setSavedPaths] = useState<any[]>([]);

  const generateLearningPath = async () => {
    if (!targetSkill.trim()) {
      toast({
        title: 'Skill Required',
        description: 'Please enter a skill you want to learn.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate learning path generation for now
      const mockPath = {
        overview: `Master ${targetSkill} with this comprehensive learning pathway designed to take you from beginner to advanced level.`,
        modules: [
          {
            title: `Introduction to ${targetSkill}`,
            description: 'Learn the fundamentals and core concepts',
            difficulty: 'Beginner',
            duration: '2-3 weeks',
            topics: [
              'Basic concepts and terminology',
              'Setting up development environment',
              'First practical examples'
            ],
            resources: ['Online Courses', 'Documentation', 'Tutorials']
          },
          {
            title: `Intermediate ${targetSkill}`,
            description: 'Build practical skills and projects',
            difficulty: 'Intermediate',
            duration: '4-6 weeks',
            topics: [
              'Advanced concepts and patterns',
              'Real-world project development',
              'Best practices and optimization'
            ],
            resources: ['Project-based Learning', 'Code Reviews', 'Community Forums']
          },
          {
            title: `Advanced ${targetSkill}`,
            description: 'Master complex concepts and architectures',
            difficulty: 'Advanced',
            duration: '6-8 weeks',
            topics: [
              'Complex system design',
              'Performance optimization',
              'Industry-level implementations'
            ],
            resources: ['Advanced Courses', 'Mentorship', 'Open Source Contributing']
          }
        ],
        prerequisites: ['Basic programming knowledge', 'Problem-solving skills'],
        tips: `Focus on building projects while learning ${targetSkill}. Practice regularly and don't hesitate to ask for help in community forums.`
      };

      setTimeout(() => {
        setLearningPath(mockPath);
        setLoading(false);
        toast({
          title: 'Learning Path Generated!',
          description: 'Your personalized learning roadmap is ready.',
        });
      }, 2000);
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast({
        title: 'Generation Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Learning Path Generator</h1>
                  <p className="text-orange-100 text-lg">Create personalized learning roadmaps for any skill</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    AI Learning
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Target className="w-4 h-4 mr-1" />
                    Skill Focused
                  </Badge>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900">
                  <Target className="w-6 h-6 mr-2 text-orange-600" />
                  Generate Your Learning Path
                </CardTitle>
                <p className="text-gray-600">Enter a skill you want to master</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex space-x-4">
                  <Input
                    placeholder="e.g., React, Python, Data Analysis, Digital Marketing"
                    value={targetSkill}
                    onChange={(e) => setTargetSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generateLearningPath()}
                    className="flex-1 border-2 border-gray-200 focus:border-orange-500 rounded-xl h-12 text-lg"
                  />
                  <Button
                    onClick={generateLearningPath}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
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

            {/* Learning Path Results */}
            {learningPath && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-gray-900">
                    <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                    Learning Path: {targetSkill}
                  </CardTitle>
                  <p className="text-gray-600">AI-generated roadmap to master your chosen skill</p>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Overview */}
                  {learningPath.overview && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-blue-600" />
                        Overview
                      </h3>
                      <p className="text-gray-800 leading-relaxed">{learningPath.overview}</p>
                    </div>
                  )}

                  {/* Learning Modules */}
                  {learningPath.modules && learningPath.modules.length > 0 && (
                    <div className="space-y-6 mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <PlayCircle className="w-5 h-5 mr-2 text-green-600" />
                        Learning Modules
                      </h3>
                      <div className="space-y-6">
                        {learningPath.modules.map((module: any, index: number) => (
                          <div key={index} className="group p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-900 transition-colors">{module.title}</h4>
                                  <p className="text-sm text-gray-600">{module.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                {module.difficulty && (
                                  <Badge className={`${getDifficultyColor(module.difficulty)} border rounded-xl`}>
                                    {module.difficulty}
                                  </Badge>
                                )}
                                {module.duration && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {module.duration}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Topics */}
                            {module.topics && module.topics.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-3">Topics Covered:</h5>
                                <div className="grid gap-3">
                                  {module.topics.map((topic: string, topicIndex: number) => (
                                    <div key={topicIndex} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                      <span className="text-gray-800">{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Resources */}
                            {module.resources && module.resources.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-3">Recommended Resources:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {module.resources.map((resource: string, resourceIndex: number) => (
                                    <Badge key={resourceIndex} variant="secondary" className="bg-purple-100 text-purple-800">
                                      {resource}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {learningPath.prerequisites && learningPath.prerequisites.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-yellow-600" />
                        Prerequisites
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {learningPath.prerequisites.map((prereq: string, index: number) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                            <p className="font-medium text-yellow-800">{prereq}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {learningPath.tips && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                        Learning Tips
                      </h3>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                        <p className="text-gray-800 leading-relaxed">{learningPath.tips}</p>
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

export default LearningPath;
