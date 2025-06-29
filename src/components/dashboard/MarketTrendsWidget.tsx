
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, DollarSign, Users, MapPin } from 'lucide-react';

const MarketTrendsWidget = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
    // Simulate real-time updates
    const interval = setInterval(fetchTrends, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTrends = async () => {
    try {
      const { data, error } = await supabase
        .from('market_trends')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Insert sample data if none exists
        await insertSampleTrends();
        const { data: newData } = await supabase
          .from('market_trends')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        setTrends(newData || []);
      } else {
        setTrends(data);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const insertSampleTrends = async () => {
    const sampleTrends = [
      {
        industry: 'Technology',
        job_title: 'Software Engineer',
        trend_type: 'salary',
        trend_data: { average: 95000, change: 8.5, period: 'YoY' },
        data_source: 'Market Analysis'
      },
      {
        industry: 'Technology',
        job_title: 'Data Scientist',
        trend_type: 'demand',
        trend_data: { growth: 25, openings: 15000, hotness: 'Very High' },
        data_source: 'Job Market Data'
      },
      {
        industry: 'Healthcare',
        job_title: 'Nurse Practitioner',
        trend_type: 'demand',
        trend_data: { growth: 45, openings: 8500, hotness: 'Extremely High' },
        data_source: 'Healthcare Bureau'
      },
      {
        industry: 'Finance',
        job_title: 'Financial Analyst',
        trend_type: 'salary',
        trend_data: { average: 78000, change: 4.2, period: 'YoY' },
        data_source: 'Finance Reports'
      },
      {
        industry: 'Technology',
        job_title: 'DevOps Engineer',
        trend_type: 'skills',
        trend_data: { top_skills: ['Kubernetes', 'AWS', 'Docker', 'Terraform'], demand_increase: 35 },
        data_source: 'Skills Analysis'
      }
    ];

    try {
      await supabase.from('market_trends').insert(sampleTrends);
    } catch (error) {
      console.error('Error inserting sample trends:', error);
    }
  };

  const getTrendIcon = (trendType: string, data: any) => {
    switch (trendType) {
      case 'salary':
        return data.change > 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'demand':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'skills':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTrendData = (trend: any) => {
    const data = trend.trend_data;
    switch (trend.trend_type) {
      case 'salary':
        return `$${data.average?.toLocaleString()} (${data.change > 0 ? '+' : ''}${data.change}% ${data.period})`;
      case 'demand':
        return `${data.growth}% growth, ${data.openings?.toLocaleString()} openings`;
      case 'skills':
        return `+${data.demand_increase}% demand for ${data.top_skills?.[0]}`;
      default:
        return 'Market data available';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Market Trends
          </div>
          <Badge variant="outline" className="text-xs">Live Data</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trends.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No market trends available</p>
          </div>
        ) : (
          trends.slice(0, 5).map((trend) => (
            <div key={trend.id} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="mt-1">
                {getTrendIcon(trend.trend_type, trend.trend_data)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-sm truncate">{trend.job_title}</p>
                  <Badge variant="outline" className="text-xs">
                    {trend.industry}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {formatTrendData(trend)}
                </p>
                <p className="text-xs text-gray-400">
                  {trend.data_source} • {new Date(trend.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
        
        {trends.length > 5 && (
          <p className="text-xs text-gray-500 text-center">
            +{trends.length - 5} more trends available
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketTrendsWidget;
