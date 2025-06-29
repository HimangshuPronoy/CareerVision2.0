
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Target, 
  BookOpen,
  Briefcase,
  Star
} from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Career Readiness Score',
      value: '87%',
      change: '+12%',
      changeType: 'positive',
      icon: Target,
      description: 'Based on your skills and market demand'
    },
    {
      title: 'Job Matches',
      value: '234',
      change: '+23',
      changeType: 'positive',
      icon: Briefcase,
      description: 'Relevant positions in your area'
    },
    {
      title: 'Skill Progress',
      value: '6/10',
      change: '+2',
      changeType: 'positive',
      icon: BookOpen,
      description: 'Skills completed this month'
    },
    {
      title: 'Network Growth',
      value: '1.2k',
      change: '+89',
      changeType: 'positive',
      icon: Users,
      description: 'Professional connections'
    }
  ];

  const topSkills = [
    { name: 'React.js', level: 85, demand: 'High' },
    { name: 'TypeScript', level: 78, demand: 'High' },
    { name: 'Node.js', level: 72, demand: 'Medium' },
    { name: 'Python', level: 65, demand: 'High' },
    { name: 'AWS', level: 45, demand: 'Very High' }
  ];

  const recentInsights = [
    {
      title: 'Frontend Developer roles increased by 23% this month',
      type: 'market',
      time: '2 hours ago'
    },
    {
      title: 'New TypeScript certification recommended for you',
      type: 'learning',
      time: '5 hours ago'
    },
    {
      title: 'Your profile matches 3 new senior positions',
      type: 'opportunity',
      time: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sarah!</h1>
          <p className="text-gray-600">Here's your career progress overview</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Star className="w-4 h-4 mr-1" />
          Pro Plan
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Your Top Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSkills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={skill.demand === 'Very High' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {skill.demand} Demand
                    </Badge>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
              Recent Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  insight.type === 'market' ? 'bg-blue-500' :
                  insight.type === 'learning' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{insight.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
