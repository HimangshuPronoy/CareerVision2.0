import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface SkillItem {
  name: string;
  demandScore: number;
  growthRate: number;
  relevanceScore: number;
  resources: { title: string; url: string }[];
}

interface RecommendedSkillsProps {
  skills: SkillItem[];
  loading?: boolean;
}

const RecommendedSkills = ({ skills, loading = false }: RecommendedSkillsProps) => {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {[1, 2].map((_, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-1 w-full" />
                  <div className="flex justify-between text-xs">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-1 w-full" />
                </div>
                <div className="mt-3">
                  <Skeleton className="h-3 w-32 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-careervision-500" />
          Recommended Skills to Learn
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{skill.name}</h3>
                  <span className="text-xs bg-insight-50 dark:bg-insight-900 text-insight-600 dark:text-insight-300 px-2 py-1 rounded-full">
                    +{skill.growthRate}% Growth
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Demand Score</span>
                    <span>{skill.demandScore}/100</span>
                  </div>
                  <Progress value={skill.demandScore} className="h-1" />
                  <div className="flex justify-between text-xs">
                    <span>Relevance to Your Profile</span>
                    <span>{skill.relevanceScore}/100</span>
                  </div>
                  <Progress value={skill.relevanceScore} className="h-1" />
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-medium mb-2">Learning Resources:</h4>
                  <div className="space-y-2">
                    {skill.resources.map((resource, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-left justify-between"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <span className="truncate">{resource.title}</span>
                        <ExternalLink className="h-3 w-3 ml-2 flex-shrink-0" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No skill recommendations available. Update your profile to receive personalized recommendations.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedSkills;
