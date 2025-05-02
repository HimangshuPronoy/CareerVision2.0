import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PathData {
  title: string;
  description: string;
  matchPercentage: number;
  skillsNeeded: string[];
}

interface CareerPathCardProps {
  title?: string;
  description?: string;
  matchPercentage?: number;
  skillsNeeded?: string[];
  onViewDetails?: () => void;
  paths?: PathData[];
  loading?: boolean;
}

const CareerPathCard = ({ 
  title, 
  description, 
  matchPercentage, 
  skillsNeeded = [],
  onViewDetails,
  paths = [],
  loading = false
}: CareerPathCardProps) => {
  // If paths array is provided and not empty, use the first path
  const path = paths && paths.length > 0 ? paths[0] : null;
  
  // Use either direct props or path data
  const displayTitle = title || (path ? path.title : 'Career Path');
  const displayDescription = description || (path ? path.description : 'Loading career path data...');
  const displayMatchPercentage = matchPercentage || (path ? path.matchPercentage : 0);
  const displaySkills = skillsNeeded.length > 0 ? skillsNeeded : (path ? path.skillsNeeded : []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-3" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{displayTitle}</CardTitle>
          <div className="bg-careervision-50 dark:bg-careervision-900 text-careervision-600 dark:text-careervision-300 text-sm font-medium py-1 px-2 rounded-full flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {displayMatchPercentage}% Match
          </div>
        </div>
        <CardDescription className="line-clamp-2">{displayDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Top Skills Needed:</h4>
          <div className="flex flex-wrap gap-2">
            {displaySkills.length > 0 ? (
              displaySkills.map((skill, index) => (
                <div key={index} className="bg-muted text-xs px-2 py-1 rounded-full">
                  {skill}
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground">No skills data available</div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={onViewDetails}
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerPathCard;
