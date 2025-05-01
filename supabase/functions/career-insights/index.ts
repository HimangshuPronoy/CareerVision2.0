import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.2.0'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')

// Define types
type RequestType = 'careerPath' | 'skillGap' | 'marketInsight' | 'specificCareer'

interface UserProfile {
  skills: string[]
  experience: number
  jobTitle: string
  industry: string
  education: string
  interests: string[]
  location: string
  specificJobTitle?: string
}

// Handle HTTP requests
Deno.serve(async (req) => {
  // Handle CORS
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
    // Parse request
    const { userProfile, requestType } = await req.json()

    if (!userProfile || !requestType) {
      return new Response(
        JSON.stringify({ error: 'User profile and request type are required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Generate the answer based on request type
    const result = await generateInsight(userProfile, requestType)

    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function generateInsight(userProfile: UserProfile, requestType: RequestType) {
  // Get the model
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Define prompts based on request type
  let prompt = ''
  let fallbackData = null

  switch (requestType) {
    case 'careerPath':
      prompt = buildCareerPathPrompt(userProfile)
      fallbackData = getFallbackCareerPaths(userProfile)
      break
    case 'specificCareer':
      prompt = buildSpecificCareerPrompt(userProfile)
      fallbackData = getFallbackSpecificCareer(userProfile)
      break
    case 'skillGap':
      prompt = buildSkillGapPrompt(userProfile)
      fallbackData = getFallbackSkillGap(userProfile)
      break
    case 'marketInsight':
      prompt = buildMarketInsightPrompt(userProfile)
      fallbackData = getFallbackMarketInsight(userProfile)
      break
    default:
      throw new Error('Invalid request type')
  }

  try {
    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.warn('No JSON found in response, using fallback data')
      return fallbackData
    }

    // Parse JSON
    try {
      const parsedData = JSON.parse(jsonMatch[0])
      return parsedData
    } catch (e) {
      console.warn('Failed to parse JSON, using fallback data')
      return fallbackData
    }
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    return fallbackData
  }
}

// Prompt builders
function buildCareerPathPrompt(userProfile: UserProfile): string {
  const skills = userProfile.skills.join(', ')
  const interests = userProfile.interests.join(', ')

  return `
    Based on the following profile, suggest 3 potential career paths that would be a good match:

    Profile:
    - Current Job Title: ${userProfile.jobTitle || 'Not specified'}
    - Industry: ${userProfile.industry || 'Not specified'}
    - Years of Experience: ${userProfile.experience || 0}
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${skills || 'Not specified'}
    - Interests: ${interests || 'Not specified'}
    - Location: ${userProfile.location || 'Not specified'}

    For each career path, provide:
    1. Job title
    2. Match percentage (0-100) based on current skills and experience
    3. List of skills needed for this role (4-5 key skills)
    4. A brief description of the role and why it might be a good fit

    Format your response as a JSON array with the structure:
    [
      {
        "title": "Job Title",
        "matchPercentage": 85,
        "skillsNeeded": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
        "description": "Brief description of the role and why it might be a good fit"
      },
      // additional career paths...
    ]
  `
}

function buildSpecificCareerPrompt(userProfile: UserProfile): string {
  const skills = userProfile.skills.join(', ')
  const specificJob = userProfile.specificJobTitle || 'Software Engineer'

  return `
    Analyze the following profile against the career path of "${specificJob}":

    Profile:
    - Current Job Title: ${userProfile.jobTitle || 'Not specified'}
    - Industry: ${userProfile.industry || 'Not specified'}
    - Years of Experience: ${userProfile.experience || 0}
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${skills || 'Not specified'}
    - Location: ${userProfile.location || 'Not specified'}

    Provide a detailed analysis of a career as a ${specificJob}, including:
    1. A match percentage (0-100) between the profile and requirements for this role
    2. Essential skills needed for this role (5-7 skills)
    3. Skills the person needs to develop to excel in this role (3-5 skills they might be missing)
    4. A description of the role and career path
    5. Estimated time to achieve proficiency in this role based on current skills

    Format your response as a JSON object with the structure:
    {
      "title": "${specificJob}",
      "matchPercentage": 85,
      "skillsNeeded": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
      "requiredSkills": ["Required Skill 1", "Required Skill 2", "Required Skill 3"],
      "description": "Description of the role and career path",
      "timeToAchieve": "6 months - 1 year"
    }
  `
}

function buildSkillGapPrompt(userProfile: UserProfile): string {
  const skills = userProfile.skills.join(', ')
  const interests = userProfile.interests.join(', ')

  return `
    Based on the following profile, identify skill gaps and recommend skills to learn:

    Profile:
    - Current Job Title: ${userProfile.jobTitle || 'Not specified'}
    - Industry: ${userProfile.industry || 'Not specified'}
    - Years of Experience: ${userProfile.experience || 0}
    - Current Skills: ${skills || 'Not specified'}
    - Interests: ${interests || 'Not specified'}

    Recommend 4-5 skills that would help advance this person's career, considering:
    1. Current industry trends
    2. Complementary skills to what they already know
    3. Skills with high growth potential

    For each skill, provide:
    - Skill name
    - Demand score (0-100) 
    - Growth rate (0-100)
    - Relevance score (0-100) to their current skill set
    - 2-3 specific resources to learn this skill (courses, books, tutorials)

    Format your response as a JSON array with the structure:
    [
      {
        "name": "Skill Name",
        "demandScore": 85,
        "growthRate": 90,
        "relevanceScore": 75,
        "resources": [
          {
            "title": "Resource Title",
            "url": "https://example.com"
          },
          // additional resources...
        ]
      },
      // additional skills...
    ]
  `
}

function buildMarketInsightPrompt(userProfile: UserProfile): string {
  return `
    Provide market insights for someone in the ${userProfile.industry || 'tech'} industry, with ${userProfile.experience || 0} years of experience, currently working as a ${userProfile.jobTitle || 'professional'}.

    Include:
    1. Overall industry growth rate and trends
    2. Emerging technologies or skills in high demand
    3. Salary ranges for similar roles
    4. Companies actively hiring
    5. Future outlook (next 1-3 years)

    Format your response as a JSON object with sections for each area.
  `
}

// Fallback data in case the AI fails to generate results
function getFallbackCareerPaths(userProfile: UserProfile) {
  return [
    {
      title: "Senior Software Engineer",
      matchPercentage: 90,
      skillsNeeded: ["Advanced JavaScript", "React", "System Design", "APIs"],
      description: "Lead development projects, architect solutions, and mentor junior developers in building complex software applications."
    },
    {
      title: "DevOps Engineer",
      matchPercentage: 75,
      skillsNeeded: ["CI/CD", "Docker", "Kubernetes", "Cloud Platforms"],
      description: "Bridge development and operations, automate deployment processes, and maintain infrastructure for software delivery."
    },
    {
      title: "Product Manager",
      matchPercentage: 65,
      skillsNeeded: ["User Research", "Data Analysis", "Agile Methodologies", "Communication"],
      description: "Define product vision, gather requirements, and work with engineering teams to build successful products."
    }
  ]
}

function getFallbackSpecificCareer(userProfile: UserProfile) {
  const jobTitle = userProfile.specificJobTitle || "Software Engineer"
  
  return {
    title: jobTitle,
    matchPercentage: 80,
    skillsNeeded: ["JavaScript", "TypeScript", "React", "Node.js", "Git"],
    requiredSkills: ["System Design", "Cloud Architecture", "CI/CD"],
    description: `${jobTitle} roles involve designing, developing, and maintaining software applications. You'll work in teams to implement features, fix bugs, and improve existing systems.`,
    timeToAchieve: "6-12 months"
  }
}

function getFallbackSkillGap(userProfile: UserProfile) {
  return [
    {
      name: "TypeScript",
      demandScore: 90,
      growthRate: 85,
      relevanceScore: 95,
      resources: [
        { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
        { title: "TypeScript Deep Dive", url: "https://basarat.gitbook.io/typescript/" }
      ]
    },
    {
      name: "Docker",
      demandScore: 85,
      growthRate: 80,
      relevanceScore: 75,
      resources: [
        { title: "Docker Documentation", url: "https://docs.docker.com/get-started/" },
        { title: "Docker Crash Course", url: "https://www.youtube.com/watch?v=pTFZFxd4hOI" }
      ]
    },
    {
      name: "AWS",
      demandScore: 95,
      growthRate: 90,
      relevanceScore: 80,
      resources: [
        { title: "AWS Free Tier", url: "https://aws.amazon.com/free/" },
        { title: "AWS Certified Solutions Architect", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    }
  ]
}

function getFallbackMarketInsight(userProfile: UserProfile) {
  return {
    industryGrowth: {
      rate: "14.5% annually",
      trends: [
        "Remote work becoming standard practice",
        "Increasing demand for cloud-native skills",
        "Rising importance of cybersecurity"
      ]
    },
    emergingSkills: [
      "AI/ML Engineering",
      "DevSecOps",
      "Blockchain Development",
      "Low-Code Development"
    ],
    salaryRanges: {
      junior: "$60,000 - $90,000",
      mid: "$90,000 - $130,000",
      senior: "$130,000 - $180,000",
      lead: "$160,000 - $220,000"
    },
    activeHiringCompanies: [
      "Amazon",
      "Microsoft",
      "Google",
      "Salesforce",
      "Oracle"
    ],
    futureOutlook: "Strong growth projected over the next 3 years, with increasing demand for specialized roles in AI, security, and data science."
  }
}
