import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Download, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

const ResumeBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    education: [],
    experience: [],
    customSections: []
  });

  useEffect(() => {
    if (user) {
      // Get user profile data
      const fetchUserData = async () => {
        try {
          // Get basic profile info
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            setResumeData(current => ({
              ...current,
              name: profileData.full_name || '',
              email: user.email || ''
            }));
          }

          // Get user settings and skills
          const { data: settings } = await supabase
            .from('user_settings')
            .select('skills, location')
            .eq('id', user.id)
            .single();

          if (settings) {
            setResumeData(current => ({
              ...current,
              location: settings.location || '',
              skills: Array.isArray(settings.skills) 
                ? settings.skills.map(skill => String(skill)) 
                : []
            }));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const generateAIResume = async () => {
    if (!user) return;
    
    try {
      setIsGenerating(true);
      
      // Get user data from Supabase to send to the AI
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile data:', profileError);
      }
        
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (settingsError) {
        console.error('Error fetching user settings:', settingsError);
      }
      
      // Combine available data for the AI
      const userData = {
        name: profileData?.full_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        skills: settings?.skills || [],
        experience: settings?.experience || 0,
        jobTitle: settings?.job_title || '',
        industry: settings?.industry || '',
        education: settings?.education || '',
        location: settings?.location || ''
      };
      
      // Call the AI function
      const { data, error } = await supabase.functions.invoke('generate-resume', {
        body: { userData }
      });
      
      if (error) throw error;
      
      if (data && typeof data === 'object') {
        // Update the resume data with AI generated content
        setResumeData(currentData => ({
          ...currentData,
          name: userData.name || currentData.name,
          email: userData.email || currentData.email,
          summary: data.summary || currentData.summary,
          skills: Array.isArray(data.skills) ? data.skills : currentData.skills,
          education: Array.isArray(data.education) ? data.education : currentData.education,
          experience: Array.isArray(data.experience) ? data.experience : currentData.experience
        }));
        
        toast({
          title: 'Resume generated',
          description: 'AI has generated resume content based on your profile'
        });
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: 'Generation failed',
        description: 'Could not generate resume. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportAsPdf = async () => {
    setIsExporting(true);
    toast({
      title: 'Exporting Resume',
      description: 'Preparing your resume for download...'
    });
    
    try {
      // Call a function to convert the resume to PDF format
      const { data, error } = await supabase.functions.invoke('export-resume', {
        body: { resumeData }
      });
      
      if (error) throw error;
      
      // Create a download link
      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Complete',
        description: 'Your resume has been exported successfully'
      });
    } catch (error) {
      console.error('Error exporting resume:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not export your resume. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const addEducation = () => {
    setResumeData(current => ({
      ...current,
      education: [
        ...current.education,
        {
          id: crypto.randomUUID(),
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setResumeData(current => {
      const updatedEducation = [...current.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return {
        ...current,
        education: updatedEducation
      };
    });
  };

  const removeEducation = (index: number) => {
    setResumeData(current => ({
      ...current,
      education: current.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setResumeData(current => ({
      ...current,
      experience: [
        ...current.experience,
        {
          id: crypto.randomUUID(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setResumeData(current => {
      const updatedExperience = [...current.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
      return {
        ...current,
        experience: updatedExperience
      };
    });
  };

  const removeExperience = (index: number) => {
    setResumeData(current => ({
      ...current,
      experience: current.experience.filter((_, i) => i !== index)
    }));
  };

  const addCustomSection = () => {
    setResumeData(current => ({
      ...current,
      customSections: [
        ...current.customSections,
        {
          id: crypto.randomUUID(),
          title: 'Custom Section',
          content: ''
        }
      ]
    }));
  };

  const updateCustomSection = (index: number, field: keyof ResumeSection, value: string) => {
    setResumeData(current => {
      const updatedSections = [...current.customSections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return {
        ...current,
        customSections: updatedSections
      };
    });
  };

  const removeCustomSection = (index: number) => {
    setResumeData(current => ({
      ...current,
      customSections: current.customSections.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setResumeData(current => {
      const updatedSkills = [...current.skills];
      updatedSkills[index] = value;
      return {
        ...current,
        skills: updatedSkills
      };
    });
  };

  const addSkill = () => {
    setResumeData(current => ({
      ...current,
      skills: [...current.skills, '']
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData(current => ({
      ...current,
      skills: current.skills.filter((_, i) => i !== index)
    }));
  };

  const resetResume = () => {
    setResumeData({
      name: user?.email?.split('@')[0] || 'My Resume',
      email: user?.email || '',
      phone: '',
      location: '',
      summary: '',
      skills: [],
      education: [],
      experience: [],
      customSections: []
    });
    
    toast({
      title: 'Resume Reset',
      description: 'Created a new blank resume'
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
            <p className="text-muted-foreground">
              Create and manage your professional resume with AI assistance
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={resetResume}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Resume
            </Button>
            <Button
              onClick={generateAIResume}
              disabled={isGenerating}
              className="bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resume Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <Input 
                value={resumeData.name} 
                onChange={(e) => setResumeData(current => ({ ...current, name: e.target.value }))}
                className="font-bold text-xl border-none px-0 focus-visible:ring-0"
                placeholder="Resume Title"
              />
            </CardTitle>
            <CardDescription>
              Build your resume section by section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
              </TabsList>
              
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={resumeData.email}
                      onChange={(e) => setResumeData(current => ({ ...current, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={resumeData.phone}
                      onChange={(e) => setResumeData(current => ({ ...current, phone: e.target.value }))}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={resumeData.location}
                    onChange={(e) => setResumeData(current => ({ ...current, location: e.target.value }))}
                    placeholder="City, State, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea 
                    id="summary" 
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(current => ({ ...current, summary: e.target.value }))}
                    placeholder="A brief summary of your professional background and career goals"
                    rows={5}
                  />
                </div>
              </TabsContent>
              
              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <Card key={edu.id} className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-destructive"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input 
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            placeholder="University/School Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input 
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="Bachelor's, Master's, etc."
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <Label>Field of Study</Label>
                        <Input 
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input 
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date (or Expected)</Label>
                          <Input 
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={edu.description}
                          onChange={(e) => updateEducation(index, 'description', e.target.value)}
                          placeholder="Notable achievements, GPA, relevant coursework, etc."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" onClick={addEducation} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </TabsContent>
              
              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <Card key={exp.id} className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-destructive"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Company/Organization</Label>
                          <Input 
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input 
                            value={exp.position}
                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                            placeholder="Job Title"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input 
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input 
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                            placeholder="Present (if current job)"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" onClick={addExperience} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </TabsContent>
              
              {/* Additional Information Tab */}
              <TabsContent value="additional" className="space-y-6">
                {/* Skills Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Skills</Label>
                    <Button variant="outline" size="sm" onClick={addSkill}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input 
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          placeholder="Skill name"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => removeSkill(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Custom Sections */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Custom Sections</Label>
                    <Button variant="outline" size="sm" onClick={addCustomSection}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Section
                    </Button>
                  </div>
                  
                  {resumeData.customSections.map((section, index) => (
                    <Card key={section.id} className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-destructive"
                        onClick={() => removeCustomSection(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardContent className="pt-6">
                        <div className="space-y-2 mb-4">
                          <Label>Section Title</Label>
                          <Input 
                            value={section.title}
                            onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
                            placeholder="Section Title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea 
                            value={section.content}
                            onChange={(e) => updateCustomSection(index, 'content', e.target.value)}
                            placeholder="Section content"
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab(
              activeTab === 'personal' ? 'education' :
              activeTab === 'education' ? 'experience' :
              activeTab === 'experience' ? 'additional' : 'personal'
            )}>
              {activeTab === 'additional' ? 'Back to Personal' : 'Next Section'}
            </Button>
            <Button 
              variant="outline" 
              onClick={exportAsPdf}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder; 