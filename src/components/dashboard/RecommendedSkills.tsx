import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SkillItem {
  name: string;
  demandScore: number;
  growthRate: number;
  relevanceScore: number;
  resources: { title: string; url: string }[];
  level: string;
  description: string;
  progress: number;
}

interface RecommendedSkillsProps {
  skills: SkillItem[];
}

const RecommendedSkills = ({ skills }: RecommendedSkillsProps) => {
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
          {skills.map((skill, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                <Badge variant="secondary">{skill.level}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
              <div className="mt-3">
                <Progress value={skill.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Progress: {skill.progress}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedSkills;
