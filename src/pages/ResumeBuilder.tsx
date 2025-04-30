import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { FileText, Download, Save, Plus, Trash2, Sparkles } from 'lucide-react';
import { useResumeAI } from '@/hooks/useResumeAI';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects';
  title: string;
  content: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

type Resume = Omit<Database['public']['Tables']['resumes']['Row'], 'sections'> & {
  sections: ResumeSection[];
};

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const ResumeBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, loading: subscriptionLoading, isSubscribed } = useSubscription();
  const { getResumeSuggestions, optimizeContent, getSkillsRecommendations, loading: aiLoading } = useResumeAI();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('experience');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!subscriptionLoading && !isSubscribed()) {
      toast({
        title: 'Subscription Required',
        description: 'Please subscribe to access the Resume Builder feature.',
        variant: 'destructive',
      });
      navigate('/pricing');
      return;
    }

    const checkDatabase = async () => {
      if (!user) return;

      try {
        // First, check if the table exists
        const { data: tableInfo, error: tableError } = await supabase
          .from('resumes')
          .select('count')
          .limit(1);

        if (tableError) {
          console.error('Table check error:', tableError);
          if (tableError.code === '42P01') {
            toast({
              title: 'Database Error',
              description: 'The resumes table does not exist. Please contact support.',
              variant: 'destructive',
            });
          }
          return;
        }

        console.log('Table exists, fetching resumes...');
        await fetchResumes();
      } catch (error) {
        console.error('Database check error:', error);
      }
    };

    if (user && isSubscribed()) {
      checkDatabase();
    }
  }, [user, subscriptionLoading, isSubscribed]);

  const fetchResumes = async () => {
    if (!user) {
      console.log('No user found');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching resumes for user:', user.id);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '42P01') {
          toast({
            title: 'Database Error',
            description: 'The resumes table does not exist. Please contact support.',
            variant: 'destructive',
          });
        } else if (error.code === '42501') {
          toast({
            title: 'Permission Error',
            description: 'You do not have permission to access resumes. Please try logging in again.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      console.log('Fetched data:', data);

      const formattedResumes = (data || []).map(resume => ({
        ...resume,
        sections: JSON.parse(JSON.stringify(resume.sections)) as ResumeSection[]
      }));

      console.log('Formatted resumes:', formattedResumes);

      setResumes(formattedResumes);
      if (formattedResumes.length > 0) {
        setCurrentResume(formattedResumes[0]);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load your resumes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a resume.',
        variant: 'destructive',
      });
      return;
    }

    if (!isSubscribed()) {
      toast({
        title: 'Subscription Required',
        description: 'Please subscribe to create resumes.',
        variant: 'destructive',
      });
      navigate('/pricing');
      return;
    }

    try {
      console.log('Creating new resume for user:', user.id);
      const newResume = {
        title: 'New Resume',
        sections: [],
        user_id: user.id
      };

      console.log('Inserting resume:', newResume);
      const { data, error } = await supabase
        .from('resumes')
        .insert([newResume])
        .select()
        .single();

      if (error) {
        console.error('Error creating resume:', error);
        throw error;
      }

      console.log('Created resume:', data);
      const formattedResume = {
        ...data,
        sections: JSON.parse(JSON.stringify(data.sections)) as ResumeSection[]
      };

      setResumes([formattedResume, ...resumes]);
      setCurrentResume(formattedResume);
      toast({
        title: 'Success',
        description: 'New resume created successfully.',
      });
    } catch (error) {
      console.error('Error creating resume:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create new resume. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addSection = (type: ResumeSection['type']) => {
    if (!currentResume) return;

    const newSection: ResumeSection = {
      id: generateUUID(),
      type,
      title: '',
      content: '',
    };

    const updatedResume = {
      ...currentResume,
      sections: [...currentResume.sections, newSection],
      updated_at: new Date().toISOString(),
    };

    setCurrentResume(updatedResume);
    updateResume(updatedResume);
  };

  const updateSection = (sectionId: string, updates: Partial<ResumeSection>) => {
    if (!currentResume) return;

    const updatedSections = currentResume.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    const updatedResume = {
      ...currentResume,
      sections: updatedSections,
      updated_at: new Date().toISOString(),
    };

    setCurrentResume(updatedResume);
    updateResume(updatedResume);
  };

  const deleteSection = (sectionId: string) => {
    if (!currentResume) return;

    const updatedSections = currentResume.sections.filter(
      section => section.id !== sectionId
    );

    const updatedResume = {
      ...currentResume,
      sections: updatedSections,
      updated_at: new Date().toISOString(),
    };

    setCurrentResume(updatedResume);
    updateResume(updatedResume);
  };

  const updateResume = async (resume: Resume) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          title: resume.title,
          sections: JSON.stringify(resume.sections),
          updated_at: resume.updated_at
        })
        .eq('id', resume.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const generatePDF = async () => {
    // TODO: Implement PDF generation
    toast({
      title: 'Coming Soon',
      description: 'PDF generation will be available soon.',
    });
  };

  const getAISuggestions = async () => {
    if (!isSubscribed()) {
      toast({
        title: 'Subscription Required',
        description: 'Please subscribe to use AI features.',
        variant: 'destructive',
      });
      navigate('/pricing');
      return;
    }

    if (!currentResume) return;

    const resumeContent = JSON.stringify(currentResume.sections);
    const suggestions = await getResumeSuggestions(resumeContent);
    setSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleOptimizeContent = async (sectionId: string) => {
    if (!isSubscribed()) {
      toast({
        title: 'Subscription Required',
        description: 'Please subscribe to use AI optimization features.',
        variant: 'destructive',
      });
      navigate('/pricing');
      return;
    }

    if (!currentResume) return;

    const section = currentResume.sections.find(s => s.id === sectionId);
    if (!section) return;

    const optimizedContent = await optimizeContent(section.content, section.type);
    updateSection(sectionId, { content: optimizedContent });
  };

  const handleGetSkillsRecommendations = async () => {
    if (!isSubscribed()) {
      toast({
        title: 'Subscription Required',
        description: 'Please subscribe to use AI skills recommendations.',
        variant: 'destructive',
      });
      navigate('/pricing');
      return;
    }

    if (!currentResume) return;

    const skillsSection = currentResume.sections.find(s => s.type === 'skills');
    if (!skillsSection) return;

    const currentSkills = skillsSection.content.split(',').map(s => s.trim());
    const recommendedSkills = await getSkillsRecommendations('Software Engineer', currentSkills);

    const updatedSkills = [...new Set([...currentSkills, ...recommendedSkills])];
    updateSection(skillsSection.id, { content: updatedSkills.join(', ') });
  };

  if (subscriptionLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSubscribed()) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Subscription Required</h2>
            <p className="text-muted-foreground mb-4">
              Please subscribe to access the Resume Builder feature and create professional resumes with AI assistance.
            </p>
            <Button onClick={() => navigate('/pricing')}>
              View Pricing Plans
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <div className="space-x-2">
            <Button onClick={getAISuggestions} variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Suggestions
            </Button>
            <Button onClick={createNewResume}>
              <Plus className="mr-2 h-4 w-4" />
              New Resume
            </Button>
            <Button onClick={generatePDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : currentResume ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                    </TabsList>

                    {['experience', 'education', 'skills', 'projects'].map((type) => (
                      <TabsContent key={type} value={type}>
                        <div className="space-y-4">
                          {currentResume.sections
                            .filter(section => section.type === type)
                            .map(section => (
                              <Card key={section.id} className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                  <Input
                                    value={section.title}
                                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                    placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Title`}
                                    className="text-lg font-semibold"
                                  />
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleOptimizeContent(section.id)}
                                      disabled={aiLoading}
                                    >
                                      <Sparkles className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => deleteSection(section.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <Textarea
                                  value={section.content}
                                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                  placeholder={`Enter your ${type} details...`}
                                  className="min-h-[100px]"
                                />
                                {type === 'experience' || type === 'education' ? (
                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Input
                                      type="date"
                                      value={section.startDate}
                                      onChange={(e) => updateSection(section.id, { startDate: e.target.value })}
                                      placeholder="Start Date"
                                    />
                                    <Input
                                      type="date"
                                      value={section.endDate}
                                      onChange={(e) => updateSection(section.id, { endDate: e.target.value })}
                                      placeholder="End Date"
                                    />
                                  </div>
                                ) : null}
                              </Card>
                            ))}
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => addSection(type as ResumeSection['type'])}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resume List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resumes.map((resume) => (
                      <Button
                        key={resume.id}
                        variant={currentResume?.id === resume.id ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => setCurrentResume(resume)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {resume.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>AI Suggestions</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                          </Badge>
                          {suggestion.score && (
                            <span className="text-sm text-muted-foreground">
                              Relevance: {suggestion.score}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{suggestion.content}</p>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Resumes Found</h2>
            <p className="text-muted-foreground mb-4">
              Create your first resume to get started with your career journey.
            </p>
            <Button onClick={createNewResume}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder; 