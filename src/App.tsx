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
import Features from "./pages/Features";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import RouteGuard from "./components/RouteGuard";

// Create a client
const queryClient = new QueryClient();

// Define App as a function component to ensure hooks work correctly
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <RouteGuard requireSubscription={true}>
                    <Dashboard />
                  </RouteGuard>
                } />
                <Route path="/trends" element={
                  <RouteGuard requireSubscription={true}>
                    <MarketTrends />
                  </RouteGuard>
                } />
                <Route path="/profile" element={
                  <RouteGuard requireSubscription={true}>
                    <Profile />
                  </RouteGuard>
                } />
                <Route path="/skills" element={
                  <RouteGuard requireSubscription={true}>
                    <Skills />
                  </RouteGuard>
                } />
                <Route path="/career-paths" element={
                  <RouteGuard requireSubscription={true}>
                    <CareerPaths />
                  </RouteGuard>
                } />
                <Route path="/settings" element={
                  <RouteGuard requireSubscription={true}>
                    <Settings />
                  </RouteGuard>
                } />
                <Route path="/resume-builder" element={
                  <RouteGuard requireSubscription={true}>
                    <ResumeBuilder />
                  </RouteGuard>
                } />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
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
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
