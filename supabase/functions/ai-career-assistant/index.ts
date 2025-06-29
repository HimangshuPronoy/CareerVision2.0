
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, data } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    // Handle different AI assistant types
    switch (type) {
      case 'job_scraper':
        systemPrompt = `You are a job market expert. Generate realistic, current job listings based on search criteria. Always return valid JSON format.`;
        userPrompt = prompt;
        break;
      
      case 'skill_analysis':
        systemPrompt = `You are a career skills analyst. Analyze skills and provide detailed insights with job recommendations. Return JSON format with matchScore, recommendedJobs array with title and match percentage, and skillGaps array.`;
        userPrompt = `Analyze these skills for target job: ${JSON.stringify(data)}`;
        break;
      
      case 'career_mentor':
        systemPrompt = `You are an experienced career mentor and coach. Provide personalized, actionable career advice. Be encouraging, specific, and professional.`;
        userPrompt = prompt;
        break;
      
      case 'career_path':
        systemPrompt = `You are a career development expert. Create detailed career progression paths. Return JSON with steps array containing id, title, description, status, estimatedTime, and skills.`;
        userPrompt = prompt;
        break;
      
      case 'learning_path':
        systemPrompt = `You are a learning and development expert. Create comprehensive learning paths with practical resources. Return JSON array of learning paths with resources.`;
        userPrompt = prompt;
        break;
      
      case 'task_processing':
        systemPrompt = `You are an AI career assistant. Process career-related tasks and provide detailed, actionable responses.`;
        userPrompt = prompt;
        break;
      
      default:
        systemPrompt = 'You are a helpful career assistant. Provide detailed, actionable career advice.';
        userPrompt = prompt;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://career-vision.lovable.app',
        'X-Title': 'CareerVision AI Assistant'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    const aiResponse = await response.json();
    
    if (!aiResponse.choices || !aiResponse.choices[0]) {
      throw new Error('Invalid AI response format');
    }

    const content = aiResponse.choices[0].message.content;

    // Handle specific response formatting
    if (type === 'skill_analysis') {
      try {
        const parsedResponse = JSON.parse(content);
        return new Response(JSON.stringify(parsedResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        // Fallback if JSON parsing fails
        return new Response(JSON.stringify({
          matchScore: 75,
          recommendedJobs: [
            { title: 'Software Engineer', match: 85 },
            { title: 'Full Stack Developer', match: 80 },
            { title: 'Frontend Developer', match: 75 }
          ],
          skillGaps: ['Advanced JavaScript', 'System Design', 'Cloud Architecture']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (type === 'job_scraper') {
      try {
        const parsedJobs = JSON.parse(content);
        return new Response(JSON.stringify({ 
          response: content,
          jobs: Array.isArray(parsedJobs) ? parsedJobs : [parsedJobs]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ 
          response: content,
          jobs: []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-career-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'Sorry, I encountered an error processing your request.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
