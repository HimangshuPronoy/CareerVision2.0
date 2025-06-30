
-- Create skill assessments table
CREATE TABLE public.skill_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  skills JSONB NOT NULL, -- {skill_name: proficiency_level}
  target_job_title TEXT,
  assessment_results JSONB, -- AI analysis results
  recommended_jobs JSONB, -- Array of recommended jobs
  skill_gaps JSONB, -- Skills needed for target job
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create network connections table
CREATE TABLE public.network_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  connection_name TEXT NOT NULL,
  connection_title TEXT,
  company TEXT,
  industry TEXT,
  connection_type TEXT CHECK (connection_type IN ('linkedin', 'colleague', 'mentor', 'referral', 'conference')),
  interaction_frequency TEXT CHECK (interaction_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'rarely')),
  last_interaction_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market trends table
CREATE TABLE public.market_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  job_title TEXT NOT NULL,
  trend_type TEXT NOT NULL CHECK (trend_type IN ('salary', 'demand', 'skills', 'location')),
  trend_data JSONB NOT NULL,
  data_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create career readiness metrics table
CREATE TABLE public.career_readiness_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  skills_score INTEGER NOT NULL CHECK (skills_score >= 0 AND skills_score <= 100),
  experience_score INTEGER NOT NULL CHECK (experience_score >= 0 AND experience_score <= 100),
  network_score INTEGER NOT NULL CHECK (network_score >= 0 AND network_score <= 100),
  market_alignment_score INTEGER NOT NULL CHECK (market_alignment_score >= 0 AND market_alignment_score <= 100),
  improvement_areas JSONB,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_readiness_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for skill_assessments
CREATE POLICY "Users can view their own skill assessments" ON public.skill_assessments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skill assessments" ON public.skill_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skill assessments" ON public.skill_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for network_connections
CREATE POLICY "Users can view their own network connections" ON public.network_connections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own network connections" ON public.network_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own network connections" ON public.network_connections
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own network connections" ON public.network_connections
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for market_trends (public read access)
CREATE POLICY "Anyone can view market trends" ON public.market_trends
  FOR SELECT USING (true);

-- RLS policies for career_readiness_metrics
CREATE POLICY "Users can view their own career readiness metrics" ON public.career_readiness_metrics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own career readiness metrics" ON public.career_readiness_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
