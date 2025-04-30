import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MarketTrends from "./pages/MarketTrends";
import Skills from "./pages/Skills";
import CareerPaths from "./pages/CareerPaths";
import ResumeBuilder from "./pages/ResumeBuilder";
import { Pricing } from './pages/Pricing';
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionGuard } from '@/components/SubscriptionGuard';

// Create a client
const queryClient = new QueryClient();

// Define App as a function component to ensure hooks work correctly
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <SubscriptionGuard>
                  <Dashboard />
                </SubscriptionGuard>
              } />
              <Route path="/trends" element={
                <SubscriptionGuard>
                  <MarketTrends />
                </SubscriptionGuard>
              } />
              <Route path="/profile" element={
                <SubscriptionGuard>
                  <Profile />
                </SubscriptionGuard>
              } />
              <Route path="/skills" element={
                <SubscriptionGuard>
                  <Skills />
                </SubscriptionGuard>
              } />
              <Route path="/career-paths" element={
                <SubscriptionGuard>
                  <CareerPaths />
                </SubscriptionGuard>
              } />
              <Route path="/resume" element={
                <SubscriptionGuard>
                  <ResumeBuilder />
                </SubscriptionGuard>
              } />
              <Route path="/settings" element={
                <SubscriptionGuard>
                  <Settings />
                </SubscriptionGuard>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
