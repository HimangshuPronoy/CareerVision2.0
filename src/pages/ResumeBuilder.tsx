
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Plus,
  Download,
  Eye,
  Sparkles
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

const ResumeBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('personal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });

  useEffect(() => {
    if (user) {
      loadResumeData();
    }
  }, [user]);

  const loadResumeData = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profile) {
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: profile.full_name || '',
            email: profile.email || ''
          }
        }));
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    }
  };

  const generateWithAI = async (section: string) => {
    setIsGenerating(true);
    try {
      let prompt = '';
      switch (section) {
        case 'summary':
          prompt = `Create a professional resume summary for someone with the following background: ${JSON.stringify(resumeData)}. Make it compelling and tailored to their experience.`;
          break;
        case 'skills':
          prompt = `Based on this resume data: ${JSON.stringify(resumeData)}, suggest relevant skills that should be highlighted. Return as a comma-separated list.`;
          break;
        default:
          prompt = `Improve the ${section} section of this resume: ${JSON.stringify(resumeData)}`;
      }

      const { data, error } = await supabase.functions.invoke('process-career-task', {
        body: { prompt, context: resumeData }
      });

      if (error) throw error;

      if (section === 'summary') {
        setResumeData(prev => ({ ...prev, summary: data.response }));
      } else if (section === 'skills') {
        const skillsArray = data.response.split(',').map((skill: string) => skill.trim());
        setResumeData(prev => ({ ...prev, skills: skillsArray }));
      }

      toast({
        title: 'AI Enhancement Complete',
        description: `Your ${section} has been enhanced with AI suggestions.`,
      });
    } catch (error) {
      console.error('Error generating with AI:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate AI content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: ''
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Resume Builder</h1>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-8 space-y-3">
            <Button className="w-full" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">
                {sections.find(s => s.id === activeSection)?.label}
              </CardTitle>
              {(activeSection === 'summary' || activeSection === 'skills') && (
                <Button
                  onClick={() => generateWithAI(activeSection)}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Enhance with AI'}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {activeSection === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={resumeData.personalInfo.website}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, website: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              {activeSection === 'summary' && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write a compelling professional summary..."
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    rows={8}
                  />
                </div>
              )}

              {activeSection === 'experience' && (
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <Card key={exp.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].title = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].company = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                        />
                        <Input
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].location = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                        />
                        <div className="flex space-x-2">
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[index].startDate = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: updated }));
                            }}
                          />
                          <Input
                            type="date"
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[index].endDate = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: updated }));
                            }}
                          />
                        </div>
                      </div>
                      <Textarea
                        placeholder="Describe your achievements and responsibilities..."
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[index].description = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: updated }));
                        }}
                        rows={4}
                      />
                    </Card>
                  ))}
                  <Button onClick={addExperience} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              )}

              {activeSection === 'skills' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                        <button
                          onClick={() => {
                            const updated = resumeData.skills.filter((_, i) => i !== index);
                            setResumeData(prev => ({ ...prev, skills: updated }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a skill..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            setResumeData(prev => ({
                              ...prev,
                              skills: [...prev.skills, input.value.trim()]
                            }));
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                        if (input.value.trim()) {
                          setResumeData(prev => ({
                            ...prev,
                            skills: [...prev.skills, input.value.trim()]
                          }));
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ResumeBuilder;
