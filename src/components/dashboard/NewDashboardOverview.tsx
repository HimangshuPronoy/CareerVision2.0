import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  Briefcase, 
  BookOpen,
  Users,
  Star,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NetworkTracker from './NetworkTracker';
import CareerReadinessCalculator from './CareerReadinessCalculator';
import MarketTrendsWidget from './MarketTrendsWidget';

const NewDashboardOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [realStats, setRealStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      // Fetch all user data in parallel for better performance
      const [
        profileData,
        tasksData,
        insightsData,
        skillsData,
        networkData,
        metricsData
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id).single(),
        supabase.from('tasks').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('career_insights').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('skill_assessments').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('network_connections').select('*').eq('user_id', user?.id),
        supabase.from('career_readiness_metrics').select('*').eq('user_id', user?.id).order('calculated_at', { ascending: false }).limit(1)
      ]);

      setProfile(profileData.data);
      setTasks(tasksData.data || []);
      setInsights(insightsData.data || []);

      // Calculate real stats
      const networkSize = networkData.data?.length || 0;
      const completedTasks = tasksData.data?.filter(t => t.status === 'completed').length || 0;
      const pendingTasks = tasksData.data?.filter(t => t.status === 'pending' || t.status === 'in_progress').length || 0;
      const careerScore = metricsData.data?.[0]?.overall_score || 0;

      setRealStats({
        careerReadinessScore: careerScore,
        activeTasks: pendingTasks,
        completedTasks,
        aiInsights: insightsData.data?.length || 0,
        networkGrowth: networkSize,
        skillAssessments: skillsData.data?.length || 0
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTask = async (taskType: string, title: string, description: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user?.id,
          title,
          description,
          task_type: taskType,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Task created!',
        description: 'Your new task has been added to the queue.',
      });

      fetchAllData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Career Readiness Score',
      value: realStats?.careerReadinessScore ? `${realStats.careerReadinessScore}%` : '0%',
      change: realStats?.careerReadinessScore > 70 ? '+Excellent' : 'Needs Analysis',
      changeType: realStats?.careerReadinessScore > 70 ? 'positive' : 'neutral',
      icon: Target,
      description: 'AI-powered career readiness analysis',
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50'
    },
    {
      title: 'Active Tasks',
      value: realStats?.activeTasks?.toString() || '0',
      change: `${realStats?.completedTasks || 0} completed`,
      changeType: 'positive',
      icon: Clock,
      description: 'Tasks in progress',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'AI Insights',
      value: realStats?.aiInsights?.toString() || '0',
      change: '+New Available',
      changeType: 'positive',
      icon: Sparkles,
      description: 'Personalized recommendations',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      title: 'Network Growth',
      value: realStats?.networkGrowth?.toString() || '0',
      change: realStats?.networkGrowth > 10 ? '+Strong Network' : '+Growing',
      changeType: 'positive',
      icon: Users,
      description: 'Professional connections tracked',
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    }
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Professional'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">Your AI-powered career journey awaits</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-1" />
              AI Enhanced
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Award className="w-4 h-4 mr-1" />
              Pro Plan
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <CareerReadinessCalculator />
          <NetworkTracker />
        </div>
        <div className="space-y-8">
          <MarketTrendsWidget />
          
          {/* Recent Tasks Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-gray-900">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Tasks
                </CardTitle>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                  onClick={() => createNewTask('career_planning', 'AI Career Analysis', 'Get personalized career recommendations')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 font-medium">No tasks yet</p>
                  <p className="text-gray-500 text-sm">Create your first AI-powered task!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={index} className="group p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-200 hover:border-blue-200">
                      <div className="flex items-start space-x-4">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{task.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          <div className="flex items-center space-x-3 mt-3">
                            <Badge 
                              variant={task.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs font-medium"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : task.status === 'in_progress' ? (
                                <Clock className="w-3 h-3 mr-1" />
                              ) : (
                                <AlertCircle className="w-3 h-3 mr-1" />
                              )}
                              {task.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500 font-medium">
                              {new Date(task.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-gray-900 text-xl">🚀 AI-Powered Quick Actions</CardTitle>
          <p className="text-gray-600">Accelerate your career with intelligent tools</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Briefcase,
                title: 'Resume Analysis',
                description: 'Get AI feedback on your resume',
                gradient: 'from-blue-500 to-cyan-600',
                action: () => createNewTask('resume_review', 'AI Resume Analysis', 'Get comprehensive AI feedback on your resume')
              },
              {
                icon: BarChart3,
                title: 'Skill Analysis',
                description: 'Discover your skill gaps',
                gradient: 'from-emerald-500 to-teal-600',
                action: () => window.location.href = '/skill-analysis'
              },
              {
                icon: Users,
                title: 'Interview Prep',
                description: 'Practice with AI interviewer',
                gradient: 'from-purple-500 to-pink-600',
                action: () => createNewTask('interview_prep', 'Interview Preparation', 'Practice interviews with AI feedback')
              },
              {
                icon: TrendingUp,
                title: 'Career Planning',
                description: 'Explore career opportunities',
                gradient: 'from-orange-500 to-red-600',
                action: () => createNewTask('career_planning', 'Career Path Planning', 'Explore AI-recommended career opportunities')
              }
            ].map((item, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="h-32 flex flex-col items-center justify-center space-y-3 border-2 border-dashed border-gray-300 hover:border-solid hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group rounded-2xl"
                onClick={item.action}
              >
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{item.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewDashboardOverview;
