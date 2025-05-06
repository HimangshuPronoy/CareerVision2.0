import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MarketTrends from "./pages/MarketTrends";
import Skills from "./pages/Skills";
import CareerPaths from "./pages/CareerPaths";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Settings from "./pages/Settings";
import ResumeBuilder from "./pages/ResumeBuilder";
import Pricing from "./pages/Pricing";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import RouteGuard from "./components/RouteGuard";
import Waitlist from "./pages/Waitlist";

// Create a client
const queryClient = new QueryClient();

// Define App as a function component to ensure hooks work correctly
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Waitlist />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                
                {/* Protected routes - will redirect to waitlist while app is in waitlist mode */}
                <Route path="/app" element={
                  <RouteGuard>
                    <Index />
                  </RouteGuard>
                } />
                <Route path="/dashboard" element={
                  <RouteGuard>
                    <Dashboard />
                  </RouteGuard>
                } />
                <Route path="/trends" element={
                  <RouteGuard>
                    <MarketTrends />
                  </RouteGuard>
                } />
                <Route path="/profile" element={
                  <RouteGuard>
                    <Profile />
                  </RouteGuard>
                } />
                <Route path="/skills" element={
                  <RouteGuard>
                    <Skills />
                  </RouteGuard>
                } />
                <Route path="/career-paths" element={
                  <RouteGuard>
                    <CareerPaths />
                  </RouteGuard>
                } />
                <Route path="/settings" element={
                  <RouteGuard>
                    <Settings />
                  </RouteGuard>
                } />
                <Route path="/resume-builder" element={
                  <RouteGuard>
                    <ResumeBuilder />
                  </RouteGuard>
                } />
                <Route path="/pricing" element={
                  <RouteGuard>
                    <Pricing />
                  </RouteGuard>
                } />
                <Route path="/subscription/success" element={
                  <RouteGuard>
                    <SubscriptionSuccess />
                  </RouteGuard>
                } />
                <Route path="/subscription/cancel" element={
                  <RouteGuard>
                    <SubscriptionCancel />
                  </RouteGuard>
                } />
                <Route path="/login" element={
                  <RouteGuard requireAuth={false}>
                    <Login />
                  </RouteGuard>
                } />
                <Route path="/signup" element={
                  <RouteGuard requireAuth={false}>
                    <Signup />
                  </RouteGuard>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
