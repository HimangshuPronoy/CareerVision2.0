
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

const CareerReadinessCalculator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLatestMetrics();
    }
  }, [user]);

  const fetchLatestMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('career_readiness_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const calculateReadiness = async () => {
    setCalculating(true);
    try {
      // Fetch user data for calculation
      const [skillsData, networkData, profileData] = await Promise.all([
        supabase.from('skill_assessments').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('network_connections').select('*').eq('user_id', user?.id),
        supabase.from('profiles').select('*').eq('id', user?.id).single()
      ]);

      const skills = skillsData.data?.[0]?.skills || {};
      const networkSize = networkData.data?.length || 0;
      
      // Call AI function for comprehensive analysis
      const response = await supabase.functions.invoke('ai-career-assistant', {
        body: {
          type: 'career_readiness',
          data: {
            skills,
            experience: 'mid-level', // Could be dynamic based on user profile
            networkSize,
            targetRole: skillsData.data?.[0]?.target_job_title || 'Software Engineer'
          }
        }
      });

      if (response.error) throw response.error;

      const analysisResult = response.data;
      
      // Save metrics to database
      const { error: insertError } = await supabase
        .from('career_readiness_metrics')
        .insert({
          user_id: user?.id,
          overall_score: analysisResult.overallScore,
          skills_score: analysisResult.skillsScore,
          experience_score: analysisResult.experienceScore,
          network_score: analysisResult.networkScore,
          market_alignment_score: analysisResult.marketAlignmentScore,
          improvement_areas: analysisResult.improvements
        });

      if (insertError) throw insertError;

      await fetchLatestMetrics();

      toast({
        title: 'Career Readiness Calculated!',
        description: 'Your readiness score has been updated.',
      });
    } catch (error) {
      console.error('Error calculating readiness:', error);
      toast({
        title: 'Calculation Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Career Readiness Score
        </CardTitle>
        <Button
          size="sm"
          onClick={calculateReadiness}
          disabled={calculating}
          variant="outline"
        >
          {calculating ? (
            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-1" />
          )}
          Recalculate
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics ? (
          <>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(metrics.overall_score)}`}>
                {metrics.overall_score}%
              </div>
              <p className="text-gray-600">Overall Career Readiness</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getScoreBg(metrics.overall_score)} ${getScoreColor(metrics.overall_score)}`}>
                {metrics.overall_score >= 80 ? 'Excellent' : metrics.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Skills Proficiency</span>
                  <span>{metrics.skills_score}%</span>
                </div>
                <Progress value={metrics.skills_score} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Experience Level</span>
                  <span>{metrics.experience_score}%</span>
                </div>
                <Progress value={metrics.experience_score} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Network Strength</span>
                  <span>{metrics.network_score}%</span>
                </div>
                <Progress value={metrics.network_score} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Market Alignment</span>
                  <span>{metrics.market_alignment_score}%</span>
                </div>
                <Progress value={metrics.market_alignment_score} className="h-2" />
              </div>
            </div>

            {metrics.improvement_areas && metrics.improvement_areas.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Areas for Improvement
                </h4>
                <div className="space-y-1">
                  {metrics.improvement_areas.slice(0, 3).map((area: string, index: number) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center">
              Last updated: {new Date(metrics.calculated_at).toLocaleDateString()}
            </p>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="mb-4">Calculate your career readiness score</p>
            <Button onClick={calculateReadiness} disabled={calculating}>
              {calculating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Calculate Score
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareerReadinessCalculator;
