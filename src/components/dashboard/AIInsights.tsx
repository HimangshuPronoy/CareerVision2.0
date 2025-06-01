
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Lightbulb, RefreshCw, Search, CheckCircle2, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CareerInsight {
  title: string;
  matchPercentage: number;
  description: string;
  requiredSkills: string[];
  strengths: string[];
  gaps: string[];
}

const AIInsights = () => {
  const { getCareerPaths, getSpecificCareerPath, getUserProfile, loading, error } = useAIInsights();
  const { user } = useAuth();
  const [careerInsight, setCareerInsight] = useState<CareerInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobInput, setJobInput] = useState('');
  const [showJobInput, setShowJobInput] = useState(false);
  const [lastSearchedJob, setLastSearchedJob] = useState<string | null>(null);

  const generateInsight = async (specificJob?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to get personalized career insights.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Try to get user profile from database first
      let userProfile = await getUserProfile();
      console.log("Retrieved user profile for insights:", userProfile);
      
      // Fall back to mock profile if user profile is empty or incomplete
      if (!userProfile || !userProfile.skills || userProfile.skills.length === 0) {
        console.log("Using fallback data for insights - user needs to complete profile");
        setCareerInsight(null);
        toast({
          title: "Profile Incomplete",
          description: "Please complete your profile with skills and experience to get personalized insights.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (specificJob) {
        // Save the last searched job
        setLastSearchedJob(specificJob);
        
        // Get insight for specific job
        const jobInsight = await getSpecificCareerPath(userProfile, specificJob);
        if (jobInsight) {
          // Analyze user skills against required skills
          const userSkills = userProfile.skills.map(s => s.toLowerCase());
          const requiredSkills = jobInsight.requiredSkills?.map(s => s.toLowerCase()) || [];
          
          // Find strengths (skills user has that match requirements)
          const strengths = userSkills.filter(skill => 
            requiredSkills.some(req => req.includes(skill) || skill.includes(req))
          );
          
          // Find gaps (required skills user doesn't have)
          const gaps = requiredSkills.filter(req => 
            !userSkills.some(skill => skill.includes(req) || req.includes(skill))
          );
          
          setCareerInsight({
            title: jobInsight.title,
            matchPercentage: jobInsight.matchPercentage,
            description: jobInsight.description,
            requiredSkills: jobInsight.requiredSkills || [],
            strengths: strengths.length > 0 ? strengths : ['No matching skills found'],
            gaps: gaps.length > 0 ? gaps : ['Your skills cover all requirements!']
          });
        } else {
          setCareerInsight(null);
          toast({
            title: "Job Not Found",
            description: `We couldn't generate insights for a ${specificJob} role. Please try another job title.`,
            variant: "destructive",
          });
        }
      } else {
        // Get general career path insights
        const paths = await getCareerPaths(userProfile);
        if (paths && paths.length > 0) {
          // Get the best match instead of random
          const bestPath = paths.reduce((best, current) => 
            (current.matchPercentage > best.matchPercentage) ? current : best, paths[0]);
          
          // Analyze user skills against required skills
          const userSkills = userProfile.skills.map(s => s.toLowerCase());
          const requiredSkills = bestPath.skillsNeeded?.map(s => s.toLowerCase()) || [];
          
          // Find strengths (skills user has that match requirements)
          const strengths = userSkills.filter(skill => 
            requiredSkills.some(req => req.includes(skill) || skill.includes(req))
          );
          
          // Find gaps (required skills user doesn't have)
          const gaps = requiredSkills.filter(req => 
            !userSkills.some(skill => skill.includes(req) || req.includes(skill))
          );
          
          setCareerInsight({
            title: bestPath.title,
            matchPercentage: bestPath.matchPercentage,
            description: bestPath.description,
            requiredSkills: bestPath.skillsNeeded || [],
            strengths: strengths.length > 0 ? strengths : ['No matching skills found'],
            gaps: gaps.length > 0 ? gaps : ['Your skills cover all requirements!']
          });
          
          // Clear last searched job since this is a general insight
          setLastSearchedJob(null);
        } else {
          console.log("No career paths returned from API");
          setCareerInsight(null);
          toast({
            title: "No Insights Available",
            description: "We couldn't generate career insights at this time. Please update your profile.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error('Error generating insight:', err);
      setCareerInsight(null);
      toast({
        title: "Error",
        description: "We encountered an error while generating career insights. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowJobInput(false);
      setJobInput('');
    }
  };

  const handleSpecificJobSearch = () => {
    if (jobInput.trim()) {
      generateInsight(jobInput.trim());
    }
  };

  useEffect(() => {
    // Load initial insight
    if (user) {
      generateInsight();
    }
  }, [user]);

  return (
    <Card className="bg-gradient-to-br from-careervision-50 to-insight-50 dark:from-careervision-950 dark:to-insight-950 border-careervision-100 dark:border-careervision-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-careervision-500" />
            AI Career Insight
            {lastSearchedJob && (
              <Badge variant="outline" className="ml-2">
                {lastSearchedJob}
              </Badge>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/50 dark:bg-gray-800/50"
            onClick={() => setShowJobInput(!showJobInput)}
          >
            <Search className="h-4 w-4 mr-1" />
            Specific Job
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[180px] flex flex-col justify-between">
          {showJobInput ? (
            <div className="space-y-2 mb-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter job title (e.g. Data Scientist)" 
                  value={jobInput}
                  onChange={(e) => setJobInput(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSpecificJobSearch()}
                />
                <Button 
                  size="sm" 
                  onClick={handleSpecificJobSearch}
                  disabled={!jobInput.trim() || isLoading}
                >
                  Search
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          ) : careerInsight ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{careerInsight.title}</h3>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{careerInsight.matchPercentage}%</span>
                    <Progress value={careerInsight.matchPercentage} className="w-16 h-2" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{careerInsight.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <h4 className="font-medium flex items-center mb-1">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    Your Strengths
                  </h4>
                  <ul className="list-disc pl-4 text-xs space-y-1">
                    {careerInsight.strengths.slice(0, 3).map((strength, i) => (
                      <li key={i} className="text-green-600 dark:text-green-400">{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium flex items-center mb-1">
                    <XCircle className="h-3 w-3 mr-1 text-red-500" />
                    Skill Gaps
                  </h4>
                  <ul className="list-disc pl-4 text-xs space-y-1">
                    {careerInsight.gaps.slice(0, 3).map((gap, i) => (
                      <li key={i} className="text-red-600 dark:text-red-400">{gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground text-center">
                Complete your profile with skills and experience to get personalized career insights.
              </p>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 items-center justify-center bg-white/50 dark:bg-gray-800/50"
              onClick={() => setShowJobInput(true)}
              disabled={isLoading || !user}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Job
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 items-center justify-center bg-white/50 dark:bg-gray-800/50"
              onClick={() => generateInsight()}
              disabled={isLoading || !user}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              New Insight
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
