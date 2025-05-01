// Follow this setup guide to integrate the Gemini API with your Edge Function:
// https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/gemini/README.md

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.2.0'

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')

// Define types for resume data
interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ResumeResponse {
  summary: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
}

// This is needed to make the JSON parsing work properly
interface UserSettings {
  id: string;
  skills: string[];
  experience: number;
  job_title: string;
  industry: string;
  education: string;
  interests: string[];
  location: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    // Get the request body
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create a Supabase client with the auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: { persistSession: false },
      }
    )

    // Get user profile data
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      return new Response(
        JSON.stringify({ error: `Error fetching profile: ${profileError.message}` }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get user settings data including skills
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from('user_settings')
      .select('*')
      .eq('id', userId)
      .single()

    if (settingsError) {
      return new Response(
        JSON.stringify({ error: `Error fetching settings: ${settingsError.message}` }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Format the user data for the prompt
    const userData = {
      name: profileData.full_name || '',
      job_title: settingsData.job_title || '',
      skills: Array.isArray(settingsData.skills) ? settingsData.skills : [],
      experience: settingsData.experience || 0,
      industry: settingsData.industry || '',
      education: settingsData.education || '',
      interests: Array.isArray(settingsData.interests) ? settingsData.interests : []
    }

    // Generate the content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create the prompt for generating the resume
    const prompt = `
      I need you to create a professional resume for ${userData.name}, who works as a ${userData.job_title} in the ${userData.industry} industry.
      
      Here's what I know about this person:
      - Skills: ${userData.skills.join(', ')}
      - Years of experience: ${userData.experience}
      - Education: ${userData.education}
      - Interests: ${userData.interests.join(', ')}
      
      Please generate a complete resume including:
      
      1. A professional summary paragraph (first person perspective)
      2. A list of skills (at least 8-10 skills, including the ones provided and additional relevant ones)
      3. Education history (create ONE detailed entry based on the education information)
      4. Professional experience (create TWO detailed job entries with responsibilities and achievements)
      
      Format your response as a JSON object with these fields:
      {
        "summary": "Professional summary paragraph",
        "skills": ["Skill 1", "Skill 2", ...],
        "education": [
          {
            "id": "unique-id-1",
            "institution": "University/School Name",
            "degree": "Degree Type",
            "fieldOfStudy": "Major/Field",
            "startDate": "YYYY-MM",
            "endDate": "YYYY-MM",
            "description": "Description of education"
          }
        ],
        "experience": [
          {
            "id": "unique-id-2",
            "company": "Company Name",
            "position": "Job Title",
            "startDate": "YYYY-MM",
            "endDate": "YYYY-MM",
            "description": "Detailed job description with bullet points on achievements"
          }
        ]
      }
      
      Make the content compelling, professional, and highlight achievements where possible.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract the JSON from the response
    let jsonData: ResumeResponse
    try {
      // Find JSON object in the response (in case there's additional text around it)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      jsonData = JSON.parse(jsonMatch[0]) as ResumeResponse
    } catch (error) {
      console.error('Failed to parse JSON:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate resume content' }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Ensure IDs are present for each item
    if (jsonData.education) {
      jsonData.education = jsonData.education.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID()
      }))
    }
    
    if (jsonData.experience) {
      jsonData.experience = jsonData.experience.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID()
      }))
    }

    return new Response(
      JSON.stringify(jsonData),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 