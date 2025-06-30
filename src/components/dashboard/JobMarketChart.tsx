
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const JobMarketChart = () => {
  const trendData = [
    { month: 'Jan', demand: 320, salary: 85000 },
    { month: 'Feb', demand: 335, salary: 87000 },
    { month: 'Mar', demand: 378, salary: 89000 },
    { month: 'Apr', demand: 425, salary: 91000 },
    { month: 'May', demand: 489, salary: 93000 },
    { month: 'Jun', demand: 512, salary: 95000 },
  ];

  const skillDemand = [
    { skill: 'React', demand: 89, growth: 12 },
    { skill: 'TypeScript', demand: 76, growth: 8 },
    { skill: 'Node.js', demand: 65, growth: 15 },
    { skill: 'Python', demand: 82, growth: 18 },
    { skill: 'AWS', demand: 94, growth: 25 },
  ];

  const topCompanies = [
    { name: 'Google', positions: 45, avgSalary: '$165k', growth: 'up' },
    { name: 'Microsoft', positions: 38, avgSalary: '$145k', growth: 'up' },
    { name: 'Amazon', positions: 52, avgSalary: '$135k', growth: 'down' },
    { name: 'Meta', positions: 23, avgSalary: '$155k', growth: 'up' },
    { name: 'Apple', positions: 18, avgSalary: '$175k', growth: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Market Intelligence</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Job Demand Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Average Salary Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Avg Salary']}
                />
                <Bar dataKey="salary" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skill Demand Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillDemand.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {skill.skill.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{skill.skill}</p>
                    <p className="text-sm text-gray-600">{skill.demand}% market demand</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+{skill.growth}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Hiring Companies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-600">{company.positions} open positions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{company.avgSalary}</p>
                  <div className="flex items-center space-x-1">
                    {company.growth === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${
                      company.growth === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {company.growth === 'up' ? 'Growing' : 'Declining'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobMarketChart;
