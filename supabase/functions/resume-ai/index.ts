import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0";

const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeContent, jobTitle, content, type, action, currentSkills, userId } = await req.json();
    console.log(`Processing ${action || 'suggestions'} request for user:`, userId);

    if (!geminiApiKey) {
      throw new Error("Missing Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let result;

    switch (action) {
      case 'optimize':
        result = await optimizeContent(model, content, type);
        break;
      case 'skills':
        result = await getSkillsRecommendations(model, jobTitle, currentSkills);
        break;
      default:
        result = await getResumeSuggestions(model, resumeContent, jobTitle);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function getResumeSuggestions(model: any, resumeContent: string, jobTitle?: string) {
  const prompt = `Analyze this resume content and provide suggestions for improvement. 
  ${jobTitle ? `Focus on optimizing it for a ${jobTitle} position.` : ''}
  
  Resume Content:
  ${resumeContent}
  
  Provide suggestions in the following format:
  1. Content improvements
  2. Skills to highlight
  3. ATS optimization tips`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse the response into structured suggestions
  const suggestions = text.split('\n\n').map(section => {
    const [title, ...content] = section.split('\n');
    return {
      type: title.toLowerCase().includes('content') ? 'content' :
            title.toLowerCase().includes('skills') ? 'skills' : 'optimization',
      content: content.join('\n'),
      score: Math.floor(Math.random() * 20) + 80 // Simulated relevance score
    };
  });

  return suggestions;
}

async function optimizeContent(model: any, content: string, type: string) {
  const prompt = `Optimize this ${type} section for a professional resume. 
  Make it more impactful and ATS-friendly while maintaining truthfulness.
  
  Content:
  ${content}
  
  Provide the optimized version with:
  1. Strong action verbs
  2. Quantifiable achievements
  3. Industry-specific keywords
  4. Clear and concise language`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return {
    optimizedContent: text.split('\n\n')[0] // Get the first paragraph as the optimized content
  };
}

async function getSkillsRecommendations(model: any, jobTitle: string, currentSkills: string[]) {
  const prompt = `Based on the job title "${jobTitle}" and current skills: ${currentSkills.join(', ')},
  recommend additional skills that would make the candidate more competitive.
  
  Consider:
  1. Industry-specific technical skills
  2. Soft skills valued in this role
  3. Emerging technologies in this field
  4. Complementary skills to existing ones
  
  Provide a list of recommended skills, prioritizing those most relevant to the position.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse the response into a list of skills
  const skills = text
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(skill => skill.length > 0);

  return {
    recommendedSkills: skills
  };
} 