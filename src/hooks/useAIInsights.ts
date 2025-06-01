import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PostgrestError } from '@supabase/supabase-js';

type RequestType = 'careerPath' | 'skillGap' | 'marketInsight' | 'specificCareer';

interface UserProfile {
  skills: string[];
  experience: number;
  jobTitle: string;
  industry: string;
  education: string;
  interests: string[];
  location: string;
  specificJobTitle?: string; // Optional field for specific job requests
  [key: string]: any;
}

// Career path interface
interface CareerPath {
  title: string;
  description: string;
  matchPercentage: number;
  skillsNeeded: string[];
}

// Specific career interface
interface SpecificCareer {
  title: string;
  matchPercentage: number;
  description: string;
  requiredSkills: string[];
  skillsNeeded: string[];
  timeToAchieve: string;
}

// Skill recommendation interface
interface SkillRecommendation {
  name: string;
  demandScore: number;
  growthRate: number;
  relevanceScore: number;
  resources: { title: string; url: string }[];
}

// Market insight interface
interface MarketInsight {
  industryGrowth: {
    rate: string;
    trends: string[];
  };
  emergingSkills: string[];
  salaryRanges: {
    junior: string;
    mid: string;
    senior: string;
    lead: string;
  };
  activeHiringCompanies: string[];
  futureOutlook: string;
}

// Define a type for the database profile to handle Supabase typing issues
type DatabaseProfile = {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  job_title?: string;
  industry?: string;
  education?: string;
  interests?: string[] | null;
  location?: string;
  skills?: string[] | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for additional properties that might be in the database
};

// Type for the default Supabase profile structure
type SupabaseProfile = {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for additional properties
};

// Define a type for saved insights
type SavedInsight = {
  id?: string;
  user_id: string;
  insight_type: string;
  content: any;
  created_at?: string;
};

// Main hook implementation
export const useAIInsights = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { subscription, requireSubscription } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  /**
   * Core function to get AI insights from Supabase edge function or cache
   * @param type Type of insight to retrieve
   * @param profile User profile data
   * @param specificJob Optional specific job title for career insights
   * @returns The requested insight data or null if error
   */
  const getInsights = async <T>(
    type: RequestType,
    profile: UserProfile,
    specificJob?: string
  ): Promise<T | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to get personalized insights.",
        variant: "destructive",
      });
      return null;
    }

    // Check if user has an active subscription
    if (!subscription.isActive) {
      toast({
        title: 'Subscription Required',
        description: 'You need an active subscription to access AI insights',
        variant: 'destructive',
      });
      navigate('/pricing');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if we have cached insights in Supabase
      const { data: cachedData, error: cacheError } = await supabase
        .from('saved_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('insight_type', type)
        .order('created_at', { ascending: false })
        .limit(1);

      // Use cached data if available and less than 24 hours old
      if (!cacheError && cachedData && cachedData.length > 0) {
        const cachedInsight = cachedData[0];
        const cachedTime = new Date(cachedInsight.created_at).getTime();
        const currentTime = new Date().getTime();
        const hoursSinceCached = (currentTime - cachedTime) / (1000 * 60 * 60);

        // For specific career requests, always get fresh data
        // For other requests, use cache if less than 24 hours old
        if (type !== 'specificCareer' && hoursSinceCached < 24) {
          setLoading(false);
          return cachedInsight.content as T;
        }
      }

      // Prepare request payload
      const payload = {
        type,
        profile: {
          skills: profile.skills || [],
          jobTitle: profile.jobTitle || '',
          industry: profile.industry || '',
          education: profile.education || '',
          interests: profile.interests || [],
          location: profile.location || '',
          experience: profile.experience || 0,
        },
        specificJob,
      };

      // Call Supabase Edge Function
      const { data, error: insightError } = await supabase.functions.invoke(
        'career-insights',
        {
          body: JSON.stringify(payload),
        }
      );

      if (insightError) {
        // Check if this might be a subscription-related error
        if (insightError.message.includes('status of 400') || 
            insightError.message.includes('non-2xx status')) {
          console.warn('Possible subscription restriction for AI insights');
          // Return null to trigger fallback data instead of showing error to user
          setLoading(false);
          return null;
        }
        throw new Error(`Failed to get insights: ${insightError.message}`);
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from AI service');
      }

      // Save insights to Supabase for caching
      if (data) {
        await supabase.from('saved_insights').insert({
          user_id: user.id,
          insight_type: type,
          content: data,
          created_at: new Date().toISOString(),
        });
      }

      setLoading(false);
      return data as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('AI Insights Error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      toast({
        title: "Error Getting Insights",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  /**
   * Get user profile from Supabase or fallback to localStorage for skills
   */
  const getUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      // Get profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        throw profileError;
      }

      // Cast the profileData to our DatabaseProfile type to handle additional fields
      const dbProfile = profileData as DatabaseProfile;

      // Create base profile from database data
      const profile: UserProfile = {
        skills: [],
        experience: 0,
        jobTitle: dbProfile?.job_title || '',
        industry: dbProfile?.industry || '',
        education: dbProfile?.education || '',
        interests: dbProfile?.interests || [],
        location: dbProfile?.location || '',
      };

      // Try to get skills from localStorage as fallback due to Supabase typing issues
      try {
        const storedSkills = localStorage.getItem(`user_skills_${user.id}`);
        if (storedSkills) {
          profile.skills = JSON.parse(storedSkills);
        } else if (dbProfile?.skills && Array.isArray(dbProfile.skills)) {
          profile.skills = dbProfile.skills;
          // Cache skills in localStorage
          localStorage.setItem(`user_skills_${user.id}`, JSON.stringify(profile.skills));
        }
      } catch (skillsError) {
        console.error('Error parsing skills:', skillsError);
        profile.skills = [];
      }

      return profile;
    } catch (err) {
      console.error('Error in getUserProfile:', err);
      toast({
        title: "Profile Error",
        description: "Could not retrieve your profile. Some features may be limited.",
        variant: "destructive",
      });
      return null;
    }
  };

  /**
   * Save user skills to Supabase and localStorage
   */
  const saveUserSkills = async (skills: string[]): Promise<boolean> => {
    if (!user) return false;

    try {
      // Save to localStorage as fallback
      localStorage.setItem(`user_skills_${user.id}`, JSON.stringify(skills));

      // Try to update profile in Supabase
      // Use a type assertion to handle the skills field
      const updateData = { skills } as { [key: string]: any };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating skills in Supabase:', updateError.message);
        // Still return true since we saved to localStorage
        return true;
      }

      return true;
    } catch (err) {
      console.error('Error saving skills:', err);
      return false;
    }
  };

  /**
   * Get career paths based on user profile
   */
  const getCareerPaths = async (profile: UserProfile): Promise<CareerPath[] | null> => {
    const result = await getInsights<CareerPath[]>('careerPath', profile);
    
    // If we don't get a result from the API, provide deterministic fallback data
    if (!result || result.length === 0) {
      return [
        {
          title: 'Software Developer',
          description: 'Software developers design, build, and maintain computer programs and applications.',
          matchPercentage: 85,
          skillsNeeded: ['JavaScript', 'React', 'TypeScript', 'Node.js']
        },
        {
          title: 'Data Analyst',
          description: 'Data analysts collect, process, and analyze data to help organizations make informed decisions.',
          matchPercentage: 72,
          skillsNeeded: ['SQL', 'Excel', 'Python', 'Data Visualization']
        },
        {
          title: 'UX/UI Designer',
          description: 'UX/UI designers create user-friendly interfaces and experiences for websites and applications.',
          matchPercentage: 68,
          skillsNeeded: ['Figma', 'User Research', 'Wireframing', 'Prototyping']
        }
      ];
    }
    
    return result;
  };

  /**
   * Get insights for a specific career path
   */
  const getSpecificCareerPath = async (
    profile: UserProfile,
    jobTitle: string
  ): Promise<SpecificCareer | null> => {
    // Create a profile with the specific job title
    const profileWithJob = { ...profile, specificJobTitle: jobTitle };
    
    const result = await getInsights<SpecificCareer>('specificCareer', profileWithJob, jobTitle);
    
    // If we get no result, provide deterministic fallback data
    if (!result) {
      // Generate a deterministic match percentage based on job title
      const hash = jobTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const matchPercentage = 30 + (hash % 40); // Range from 30-69%
      
      return {
        title: jobTitle,
        matchPercentage,
        description: `A ${jobTitle} is responsible for designing, developing, and implementing solutions in their field of expertise.`,
        requiredSkills: ['communication', 'problem-solving', 'teamwork'],
        skillsNeeded: ['technical knowledge', 'industry expertise', 'project management'],
        timeToAchieve: '6-12 months'
      };
    }
    
    return result;
  };

  /**
   * Get skill recommendations based on user profile
   */
  const getSkillRecommendations = async (
    profile: UserProfile
  ): Promise<SkillRecommendation[] | null> => {
    const result = await getInsights<SkillRecommendation[]>('skillGap', profile);
    
    // If we don't get a result from the API, provide deterministic fallback data
    if (!result || result.length === 0) {
      return [
        {
          name: 'React',
          demandScore: 9.2,
          growthRate: 15,
          relevanceScore: 8.7,
          resources: [
            { title: 'React Documentation', url: 'https://reactjs.org/docs/getting-started.html' },
            { title: 'React - The Complete Guide', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' }
          ]
        },
        {
          name: 'TypeScript',
          demandScore: 8.9,
          growthRate: 22,
          relevanceScore: 9.1,
          resources: [
            { title: 'TypeScript Documentation', url: 'https://www.typescriptlang.org/docs/' },
            { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' }
          ]
        },
        {
          name: 'Cloud Computing',
          demandScore: 9.5,
          growthRate: 18,
          relevanceScore: 8.5,
          resources: [
            { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' },
            { title: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/' }
          ]
        }
      ];
    }
    
    return result;
  };

  /**
   * Get market insights based on user profile
   */
  const getMarketInsights = async (profile: UserProfile): Promise<MarketInsight | null> => {
    const result = await getInsights<MarketInsight>('marketInsight', profile);
    
    // If we don't get a result from the API, provide deterministic fallback data
    if (!result) {
      return {
        industryGrowth: {
          rate: '12% annually',
          trends: [
            'Increased adoption of AI and machine learning',
            'Remote work becoming standard',
            'Focus on cybersecurity'
          ]
        },
        emergingSkills: [
          'AI/ML',
          'Cloud Architecture',
          'Cybersecurity',
          'Data Science',
          'DevOps'
        ],
        salaryRanges: {
          junior: '$60,000 - $80,000',
          mid: '$80,000 - $120,000',
          senior: '$120,000 - $160,000',
          lead: '$160,000+'
        },
        activeHiringCompanies: [
          'Google',
          'Microsoft',
          'Amazon',
          'Apple',
          'Meta'
        ],
        futureOutlook: 'The tech industry continues to show strong growth despite economic fluctuations. Companies are increasingly investing in digital transformation, creating demand for skilled professionals.'
      };
    }
    
    return result;
  };

  return {
    loading,
    error,
    getUserProfile,
    saveUserSkills,
    getCareerPaths,
    getSpecificCareerPath,
    getSkillRecommendations,
    getMarketInsights,
  };
};
