
-- Create career_conversations table for career mentor
CREATE TABLE public.career_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create career_paths table for career path feature
CREATE TABLE public.career_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_career TEXT NOT NULL,
  path_data JSONB NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_paths table for learning path feature
CREATE TABLE public.learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_skill TEXT NOT NULL,
  path_data JSONB NOT NULL,
  resources JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.career_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

-- Create policies for career_conversations
CREATE POLICY "Users can view their own conversations" 
  ON public.career_conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" 
  ON public.career_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for career_paths
CREATE POLICY "Users can view their own career paths" 
  ON public.career_paths 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own career paths" 
  ON public.career_paths 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career paths" 
  ON public.career_paths 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for learning_paths
CREATE POLICY "Users can view their own learning paths" 
  ON public.learning_paths 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning paths" 
  ON public.learning_paths 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning paths" 
  ON public.learning_paths 
  FOR UPDATE 
  USING (auth.uid() = user_id);
