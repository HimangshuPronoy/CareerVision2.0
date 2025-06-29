
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId, taskType, prompt, context } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user context if taskId provided
    let task = null;
    let profile = null;
    let preferences = null;

    if (taskId) {
      const { data: taskData, error: taskError } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError || !taskData) {
        throw new Error('Task not found');
      }
      task = taskData;

      const { data: profileData } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', task.user_id)
        .single();

      const { data: preferencesData } = await supabaseClient
        .from('user_preferences')
        .select('*')
        .eq('id', task.user_id)
        .single();

      profile = profileData;
      preferences = preferencesData;
    }

    // Prepare AI prompt based on task type or direct prompt
    let aiPrompt = '';
    
    if (prompt) {
      aiPrompt = prompt;
    } else if (task) {
      switch (taskType) {
        case 'resume_review':
          aiPrompt = `As a professional career coach, provide detailed feedback on a resume for ${profile?.full_name || 'a professional'}. 
          
          Task: ${task.title}
          Description: ${task.description}
          
          Please provide specific, actionable advice on:
          1. Resume structure and formatting
          2. Content optimization
          3. Keyword suggestions for ATS systems
          4. Skills highlighting
          5. Achievement quantification
          
          Keep the response professional and constructive.`;
          break;
          
        case 'interview_prep':
          aiPrompt = `As an expert interview coach, help prepare ${profile?.full_name || 'a professional'} for their upcoming interviews.
          
          Task: ${task.title}
          Description: ${task.description}
          Experience Level: ${preferences?.experience_level || 'not specified'}
          Industries: ${preferences?.preferred_industries?.join(', ') || 'not specified'}
          
          Please provide:
          1. Common interview questions for their level
          2. STAR method examples
          3. Questions to ask the interviewer
          4. Industry-specific preparation tips
          5. Confidence-building strategies`;
          break;
          
        case 'skill_assessment':
          aiPrompt = `As a career development specialist, analyze the skill gaps for ${profile?.full_name || 'a professional'}.
          
          Task: ${task.title}
          Description: ${task.description}
          Current Skills: ${preferences?.skills?.join(', ') || 'not specified'}
          Experience Level: ${preferences?.experience_level || 'not specified'}
          Target Industries: ${preferences?.preferred_industries?.join(', ') || 'not specified'}
          
          Please provide:
          1. Critical skills analysis for their target roles
          2. Skill gap identification
          3. Learning path recommendations
          4. Timeline for skill development
          5. Resources and certification suggestions`;
          break;
          
        case 'career_planning':
          aiPrompt = `As a strategic career advisor, create a comprehensive career development plan for ${profile?.full_name || 'a professional'}.
          
          Task: ${task.title}
          Description: ${task.description}
          Experience Level: ${preferences?.experience_level || 'not specified'}
          Career Goals: ${preferences?.career_goals?.join(', ') || 'not specified'}
          Preferred Industries: ${preferences?.preferred_industries?.join(', ') || 'not specified'}
          Location: ${preferences?.location || 'not specified'}
          Remote Preference: ${preferences?.remote_preference ? 'Yes' : 'No'}
          
          Please provide:
          1. Career trajectory analysis
          2. Short-term and long-term goals
          3. Industry trends and opportunities
          4. Networking strategies
          5. Personal branding recommendations`;
          break;
          
        default:
          aiPrompt = `Please provide professional career advice for: ${task.title} - ${task.description}`;
      }
    }

    // Call OpenRouter API with Deepseek V3
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career coach and professional development advisor. Provide detailed, actionable, and personalized career advice. Always be encouraging and constructive in your feedback.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    // Update task if provided
    if (taskId) {
      const { error: updateError } = await supabaseClient
        .from('tasks')
        .update({
          status: 'completed',
          ai_response: aiContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) {
        throw updateError;
      }

      // Create career insight
      const insightType = taskType === 'resume_review' ? 'skill_gap' :
                         taskType === 'interview_prep' ? 'career_path' :
                         taskType === 'skill_assessment' ? 'skill_gap' :
                         'career_path';

      await supabaseClient
        .from('career_insights')
        .insert({
          user_id: task.user_id,
          insight_type: insightType,
          title: `${task.title} - Completed`,
          content: aiContent.substring(0, 500) + '...',
          metadata: {
            task_id: taskId,
            task_type: taskType
          }
        });
    }

    return new Response(
      JSON.stringify({ success: true, response: aiContent }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing task:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
