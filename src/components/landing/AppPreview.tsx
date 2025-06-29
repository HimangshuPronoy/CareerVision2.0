
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Activity,
  Calendar
} from 'lucide-react';

const AppPreview = () => {
  return (
    <div className="relative max-w-lg mx-auto">
      {/* Main Dashboard Preview */}
      <div className="bg-gray-50 rounded-3xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-600">Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-light text-gray-900">87%</span>
              </div>
              <p className="text-xs text-gray-600">Career Match</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-green-500" />
                <span className="text-xl font-light text-gray-900">234</span>
              </div>
              <p className="text-xs text-gray-600">Job Matches</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-purple-500" />
                <span className="text-xl font-light text-gray-900">12</span>
              </div>
              <p className="text-xs text-gray-600">Skills to Learn</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-light text-gray-900">4.2</span>
              </div>
              <p className="text-xs text-gray-600">Readiness</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Preview */}
        <Card className="bg-white rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Market Trends</h4>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Software Engineer</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                    <div className="w-12 h-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-900">+23%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Data Scientist</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                    <div className="w-10 h-1.5 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-900">+18%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Product Manager</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                    <div className="w-8 h-1.5 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-900">+15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-2xl opacity-60"></div>
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-100 rounded-2xl opacity-40"></div>
    </div>
  );
};

export default AppPreview;
