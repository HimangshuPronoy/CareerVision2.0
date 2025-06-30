
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Star } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const analysisResults = {
    overallScore: 87,
    sections: [
      { name: 'Contact Information', score: 95, status: 'excellent' },
      { name: 'Professional Summary', score: 82, status: 'good' },
      { name: 'Work Experience', score: 90, status: 'excellent' },
      { name: 'Skills Section', score: 75, status: 'good' },
      { name: 'Education', score: 88, status: 'excellent' },
      { name: 'Keywords Optimization', score: 68, status: 'needs-improvement' }
    ],
    recommendations: [
      'Add more industry-specific keywords to improve ATS compatibility',
      'Include quantifiable achievements in your work experience',
      'Consider adding relevant certifications to strengthen your profile',
      'Optimize your skills section with in-demand technologies'
    ],
    matchedJobs: [
      { title: 'Senior Frontend Developer', company: 'TechCorp', match: 92 },
      { title: 'React Developer', company: 'StartupXYZ', match: 88 },
      { title: 'Full Stack Engineer', company: 'InnovateLab', match: 85 }
    ]
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">AI Resume Analyzer</h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Star className="w-4 h-4 mr-1" />
              AI Powered
            </Badge>
          </div>

          {!analysisComplete ? (
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get instant AI-powered analysis and personalized recommendations
                    </p>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="w-full max-w-md space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        <span className="text-purple-600 font-medium">Analyzing your resume...</span>
                      </div>
                      <Progress value={75} className="w-full" />
                    </div>
                  ) : (
                    <Button 
                      onClick={handleAnalyze}
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Choose File or Drag & Drop
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Resume Analysis Results</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">{analysisResults.overallScore}/100</span>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResults.sections.map((section, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{section.score}%</span>
                          {section.status === 'excellent' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : section.status === 'good' ? (
                            <CheckCircle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysisResults.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Job Matches</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResults.matchedJobs.map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">{job.match}%</span>
                          <p className="text-xs text-gray-500">Match</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalyzer;
