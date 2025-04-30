import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AIResumeSuggestion {
  type: 'content' | 'skills' | 'optimization';
  content: string;
  score?: number;
}

export const useResumeAI = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getResumeSuggestions = async (
    resumeContent: string,
    jobTitle?: string
  ): Promise<AIResumeSuggestion[]> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("You must be logged in to use this feature");
      }

      // Call the edge function for AI suggestions
      const { data, error } = await supabase.functions.invoke('resume-ai', {
        body: { 
          resumeContent,
          jobTitle,
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as AIResumeSuggestion[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI suggestions';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const optimizeContent = async (
    content: string,
    type: 'experience' | 'education' | 'skills' | 'projects'
  ): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("You must be logged in to use this feature");
      }

      const { data, error } = await supabase.functions.invoke('resume-ai', {
        body: { 
          content,
          type,
          action: 'optimize',
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.optimizedContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize content';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return content;
    } finally {
      setLoading(false);
    }
  };

  const getSkillsRecommendations = async (
    jobTitle: string,
    currentSkills: string[]
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("You must be logged in to use this feature");
      }

      const { data, error } = await supabase.functions.invoke('resume-ai', {
        body: { 
          jobTitle,
          currentSkills,
          action: 'skills',
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.recommendedSkills;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get skill recommendations';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getResumeSuggestions,
    optimizeContent,
    getSkillsRecommendations
  };
}; 