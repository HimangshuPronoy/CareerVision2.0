
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import SkillAnalysis from "./pages/SkillAnalysis";
import JobScraper from "./pages/JobScraper";
import JobMarket from "./pages/JobMarket";
import CareerMentor from "./pages/CareerMentor";
import ResumeBuilder from "./pages/ResumeBuilder";
import CareerPath from "./pages/CareerPath";
import LearningPath from "./pages/LearningPath";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/layout/Sidebar";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isLandingPage = location.pathname === '/' || 
                       location.pathname === '/features' || 
                       location.pathname === '/pricing' ||
                       location.pathname === '/privacy' ||
                       location.pathname === '/terms';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && !isLandingPage && (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-x-hidden">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/skill-analysis" element={<SkillAnalysis />} />
              <Route path="/job-scraper" element={<JobScraper />} />
              <Route path="/job-market" element={<JobMarket />} />
              <Route path="/career-mentor" element={<CareerMentor />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/career-path" element={<CareerPath />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      )}
      
      {(isAuthPage || isLandingPage) && (
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
