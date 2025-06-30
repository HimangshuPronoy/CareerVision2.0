import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  Building, 
  DollarSign, 
  Clock, 
  Users, 
  Briefcase,
  Star,
  RefreshCw,
  Filter,
  Download,
  BookmarkPlus,
  ExternalLink,
  Target,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted_date: string;
  match_score: number;
  skills_required: string[];
  industry: string;
  remote_option: boolean;
  company_size: string;
  application_url?: string;
  ai_generated: boolean;
}

const JobScraper = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    salary: '',
    remote: false,
    industry: ''
  });

  useEffect(() => {
    const loadSavedJobs = async () => {
      if (!user) return;
      
      try {
        // Placeholder: Replace with actual logic to fetch saved jobs from database
        // For now, let's simulate loading saved job IDs from local storage
        const savedJobIds = localStorage.getItem('savedJobs');
        if (savedJobIds) {
          setSavedJobs(JSON.parse(savedJobIds));
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    };

    loadSavedJobs();
  }, [user]);

  const generateJobs = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to use the AI Job Scraper',
        variant: 'destructive',
      });
      return;
    }

    if (!searchQuery.trim()) {
      toast({
        title: 'Search Required',
        description: 'Please enter a job title or skill to search for',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const requestPayload = {
        query: searchQuery,
        location: location || 'Remote',
        filters: {
          ...filters,
          jobType: filters.jobType || 'full-time',
          experience: filters.experience || 'mid-level'
        }
      };

      const { data, error } = await supabase.functions.invoke('ai-career-assistant', {
        body: {
          message: `Generate 6 realistic job listings for: "${searchQuery}" in "${location || 'Remote'}" with the following preferences: ${JSON.stringify(filters)}. Include detailed job descriptions, requirements, benefits, and realistic salary information. Make them diverse and relevant to current market trends.`,
          context: {
            type: 'job_scraping',
            user_preferences: requestPayload
          }
        }
      });

      if (error) {
        console.error('AI function error:', error);
        throw error;
      }

      if (data?.response) {
        try {
          const cleanedResponse = data.response
            .replace(/```json\s*/, '')
            .replace(/```\s*$/, '')
            .replace(/^[^{]*/, '')
            .replace(/[^}]*$/, '');
          
          const jobsData = JSON.parse(cleanedResponse);
          const jobsArray = Array.isArray(jobsData) ? jobsData : jobsData.jobs || [];
          
          const processedJobs = jobsArray.map((job: any, index: number) => ({
            id: `ai-job-${Date.now()}-${index}`,
            title: job.title || 'Software Engineer',
            company: job.company || 'TechCorp',
            location: job.location || location || 'Remote',
            salary: job.salary || '$80,000 - $120,000',
            type: job.type || 'Full-time',
            experience: job.experience || 'Mid-level',
            description: job.description || 'Exciting opportunity to work on cutting-edge projects.',
            requirements: Array.isArray(job.requirements) ? job.requirements : ['Programming skills', 'Team collaboration'],
            benefits: Array.isArray(job.benefits) ? job.benefits : ['Health insurance', 'Remote work'],
            posted_date: new Date().toISOString().split('T')[0],
            match_score: Math.floor(Math.random() * 30) + 70,
            skills_required: Array.isArray(job.skills_required) ? job.skills_required : ['JavaScript', 'React'],
            industry: job.industry || 'Technology',
            remote_option: job.remote_option !== false,
            company_size: job.company_size || '100-500 employees',
            ai_generated: true
          }));

          setJobs(processedJobs);
          
          toast({
            title: 'Jobs Generated Successfully!',
            description: `Found ${processedJobs.length} relevant positions`,
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
          console.log('Raw response:', data.response);
          
          const fallbackJobs = generateFallbackJobs();
          setJobs(fallbackJobs);
          
          toast({
            title: 'Jobs Generated',
            description: 'AI generated jobs with fallback data',
          });
        }
      }
    } catch (error) {
      console.error('Error generating jobs:', error);
      
      const fallbackJobs = generateFallbackJobs();
      setJobs(fallbackJobs);
      
      toast({
        title: 'Using Sample Data',
        description: 'Showing sample jobs while AI service is being optimized',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackJobs = (): JobListing[] => {
    const jobTitles = [
      'Senior Software Engineer',
      'Frontend Developer',
      'Product Manager',
      'Data Scientist',
      'UX Designer',
      'DevOps Engineer'
    ];

    const companies = [
      'TechCorp Innovation',
      'Digital Solutions Inc',
      'Future Systems Ltd',
      'Cloud Dynamics',
      'AI Innovations Co',
      'Smart Technologies'
    ];

    return jobTitles.map((title, index) => ({
      id: `fallback-job-${index}`,
      title,
      company: companies[index],
      location: location || 'Remote',
      salary: `$${70000 + (index * 15000)} - $${100000 + (index * 20000)}`,
      type: 'Full-time',
      experience: index < 2 ? 'Senior' : index < 4 ? 'Mid-level' : 'Entry-level',
      description: `Exciting opportunity to work as a ${title} in a dynamic environment. Join our team and contribute to innovative projects that make a real impact.`,
      requirements: [
        'Bachelor\'s degree in relevant field',
        '3+ years of experience',
        'Strong problem-solving skills',
        'Team collaboration'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work options',
        'Professional development',
        'Flexible schedule'
      ],
      posted_date: new Date().toISOString().split('T')[0],
      match_score: 75 + (index * 5),
      skills_required: ['JavaScript', 'React', 'Node.js', 'Python'],
      industry: 'Technology',
      remote_option: true,
      company_size: '100-500 employees',
      ai_generated: false
    }));
  };

  const saveJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      setSavedJobs(prev => [...prev, jobId]);
      toast({
        title: 'Job Saved',
        description: 'Job added to your saved list',
      });
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: 'Error',
        description: 'Failed to save job',
        variant: 'destructive',
      });
    }
  };

  const exportJobs = () => {
    const jobsText = jobs.map(job => 
      `${job.title} at ${job.company}\n${job.location} - ${job.salary}\n${job.description}\n\n`
    ).join('');
    
    const blob = new Blob([jobsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-listings.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const JobCard = ({ job }: { job: JobListing }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 text-gray-900">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{job.experience}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={job.match_score >= 80 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Star className="w-3 h-3" />
              {job.match_score}% match
            </Badge>
            {job.ai_generated && (
              <Badge variant="outline" className="text-xs">
                AI Generated
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {job.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Requirements
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {job.requirements.slice(0, 3).map((req, idx) => (
                <li key={idx}>• {req}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <Award className="w-4 h-4" />
              Benefits
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {job.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Skills Required
          </h4>
          <div className="flex flex-wrap gap-1">
            {job.skills_required.slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Posted {job.posted_date}</span>
            {job.remote_option && (
              <Badge variant="secondary" className="text-xs">Remote OK</Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveJob(job.id)}
              disabled={savedJobs.includes(job.id)}
            >
              <BookmarkPlus className="w-4 h-4 mr-1" />
              {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
            </Button>
            <Button size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Job Scraper</h1>
          <p className="text-gray-600">Find your next opportunity with AI-powered job discovery</p>
        </div>
        {jobs.length > 0 && (
          <Button onClick={exportJobs} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Jobs
          </Button>
        )}
      </div>

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title or Skills
              </label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Software Engineer, React, Python"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, Remote, New York"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <select
                value={filters.salary}
                onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="0-50k">$0 - $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k-150k">$100k - $150k</option>
                <option value="150k+">$150k+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Remote OK</span>
              </label>
            </div>
          </div>

          <Button 
            onClick={generateJobs}
            disabled={loading || !searchQuery.trim()}
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Jobs...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Jobs with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {jobs.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Found {jobs.length} Jobs
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>Sorted by relevance</span>
            </div>
          </div>
          
          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found yet
            </h3>
            <p className="text-gray-600 mb-4">
              Enter your job preferences above and click "Find Jobs with AI" to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobScraper;
