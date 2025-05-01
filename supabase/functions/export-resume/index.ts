// Export resume to PDF
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'
import { autoTable } from 'https://esm.sh/jspdf-autotable@3.8.2'

// Resume data types
interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

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

interface ResumeData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  customSections: ResumeSection[];
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
    // Get the resume data from the request
    const { resumeData } = await req.json() as { resumeData: ResumeData }

    if (!resumeData) {
      return new Response(
        JSON.stringify({ error: 'Resume data is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create a new PDF document
    const doc = new jsPDF()
    
    // Add resume title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text(resumeData.name, 105, 20, { align: 'center' })

    // Add contact information
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const contactInfo = [
      resumeData.email,
      resumeData.phone,
      resumeData.location
    ].filter(Boolean).join(' | ')
    doc.text(contactInfo, 105, 30, { align: 'center' })

    // Add horizontal line
    doc.setLineWidth(0.5)
    doc.line(20, 35, 190, 35)

    // Add summary section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Professional Summary', 20, 45)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Handle multiline summary with word wrap
    const summaryLines = doc.splitTextToSize(resumeData.summary, 170)
    doc.text(summaryLines, 20, 55)

    // Current Y position after the summary
    let yPos = 55 + (summaryLines.length * 5)

    // Add skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      yPos += 10
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Skills', 20, yPos)
      yPos += 10
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      // Format skills as a wrapped list
      const skillsPerRow = 3
      const skillGroups = []
      for (let i = 0; i < resumeData.skills.length; i += skillsPerRow) {
        skillGroups.push(resumeData.skills.slice(i, i + skillsPerRow))
      }

      for (const group of skillGroups) {
        doc.text('• ' + group.join('    • '), 20, yPos)
        yPos += 6
      }
    }

    // Add experience section
    if (resumeData.experience && resumeData.experience.length > 0) {
      yPos += 10
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Professional Experience', 20, yPos)
      
      for (const exp of resumeData.experience) {
        yPos += 10
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(exp.position, 20, yPos)
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'italic')
        doc.text(exp.company, 20, yPos + 6)
        
        const dateText = `${exp.startDate || ''} - ${exp.endDate || 'Present'}`
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, 190 - dateWidth, yPos + 6)
        
        // Description with bullet points
        yPos += 12
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        const descLines = doc.splitTextToSize(exp.description, 170)
        doc.text(descLines, 20, yPos)
        yPos += (descLines.length * 5)
      }
    }

    // Add education section
    if (resumeData.education && resumeData.education.length > 0) {
      yPos += 10
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Education', 20, yPos)
      
      for (const edu of resumeData.education) {
        yPos += 10
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${edu.degree}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}`, 20, yPos)
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'italic')
        doc.text(edu.institution, 20, yPos + 6)
        
        const dateText = `${edu.startDate || ''} - ${edu.endDate || 'Present'}`
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, 190 - dateWidth, yPos + 6)
        
        if (edu.description) {
          yPos += 12
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          
          const descLines = doc.splitTextToSize(edu.description, 170)
          doc.text(descLines, 20, yPos)
          yPos += (descLines.length * 5)
        }
      }
    }

    // Add custom sections
    if (resumeData.customSections && resumeData.customSections.length > 0) {
      for (const section of resumeData.customSections) {
        yPos += 10
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(section.title, 20, yPos)
        
        yPos += 10
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        const contentLines = doc.splitTextToSize(section.content, 170)
        doc.text(contentLines, 20, yPos)
        yPos += (contentLines.length * 5)
      }
    }

    // Convert PDF to base64
    const pdfOutput = doc.output('datauristring')
    
    // Create a Supabase client with the auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: { persistSession: false },
      }
    )
    
    // Save the PDF to Storage if user is authenticated
    const authHeader = req.headers.get('Authorization')
    let pdfUrl = pdfOutput
    
    if (authHeader) {
      const fileName = `resumes/${resumeData.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      
      // Convert the data URI to a Blob
      const base64Data = pdfOutput.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteArrays = []
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      
      const blob = new Blob(byteArrays, { type: 'application/pdf' })
      
      // Upload to Supabase Storage
      const { data, error } = await supabaseClient
        .storage
        .from('resume-exports')
        .upload(fileName, blob, {
          contentType: 'application/pdf',
          upsert: true
        })
        
      if (error) {
        console.error('Error uploading PDF:', error)
      } else if (data) {
        // Get public URL
        const { data: urlData } = supabaseClient
          .storage
          .from('resume-exports')
          .getPublicUrl(fileName)
          
        if (urlData && urlData.publicUrl) {
          pdfUrl = urlData.publicUrl
        }
      }
    }

    return new Response(
      JSON.stringify({ pdfUrl }),
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