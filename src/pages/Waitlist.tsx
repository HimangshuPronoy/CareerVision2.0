import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, BarChart2, Trophy, TrendingUp, LineChart, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';

// Animation elements
const FloatingElement = ({ children, className }: { children: React.ReactNode, className: string }) => {
  return (
    <div className={`absolute opacity-60 animate-float ${className}`}>
      {children}
    </div>
  );
};

// Feature card component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, gradient, delay = 0 }: FeatureCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.6, 
      delay: delay * 0.2,
      type: "spring",
      stiffness: 50
    }}
    className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-accent/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/40 group"
  >
    <div className={`h-12 w-12 rounded-xl ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const Waitlist = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { toast } = useToast();
  const DISCORD_INVITE_URL = "https://discord.gg/ypwhKxFPJM";

  // Launch date countdown - set to May 15, 2025
  useEffect(() => {
    const launchDate = new Date('2025-05-15T00:00:00');
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleJoinDiscord = () => {
    setIsJoining(true);
    
    // Show toast and redirect to Discord
    setTimeout(() => {
      toast({
        title: "Opening Discord invite!",
        description: "You're being redirected to join our community.",
      });
      window.open(DISCORD_INVITE_URL, '_blank');
      setIsJoining(false);
    }, 500);
  };

  const CountdownUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-careervision-500 to-insight-500">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <MainLayout>
      <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-careervision-500/10 blur-3xl"></div>
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-insight-500/10 blur-3xl"></div>
          <div className="absolute -bottom-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-careervision-500/10 blur-3xl"></div>
        </div>
        
        {/* Floating elements for visual interest */}
        <FloatingElement className="top-1/4 left-1/5 animate-float">
          <BarChart2 size={30} className="text-careervision-500/20" />
        </FloatingElement>
        <FloatingElement className="top-1/3 right-1/4 animate-float-slow">
          <LineChart size={40} className="text-insight-500/20" />
        </FloatingElement>
        <FloatingElement className="bottom-1/4 right-1/5 animate-float-slower">
          <TrendingUp size={35} className="text-careervision-500/20" />
        </FloatingElement>
        <FloatingElement className="bottom-1/3 left-1/3 animate-float-slowest">
          <Trophy size={25} className="text-insight-500/20" />
        </FloatingElement>

        <div className="container relative z-10 flex flex-col items-center justify-center py-20 px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.8,
              staggerChildren: 0.2,
              delayChildren: 0.3
            }}
            className="max-w-3xl mx-auto text-center space-y-6 mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block rounded-full bg-careervision-50 dark:bg-careervision-900/30 px-4 py-1.5 text-sm font-medium text-careervision-700 dark:text-careervision-300 border border-careervision-200 dark:border-careervision-800/50">
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5 text-careervision-500" />
                  Launching May 15, 2025
                </span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight"
            >
              The Future of <span className="gradient-text">Career Intelligence</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              Data-driven insights to navigate your professional journey with confidence and clarity.
            </motion.p>
            
            {/* Countdown timer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium mb-6">Launching In</h3>
                <div className="flex justify-center space-x-6 md:space-x-10">
                  <CountdownUnit value={countdown.days} label="Days" />
                  <div className="text-2xl md:text-4xl font-bold">:</div>
                  <CountdownUnit value={countdown.hours} label="Hours" />
                  <div className="text-2xl md:text-4xl font-bold">:</div>
                  <CountdownUnit value={countdown.minutes} label="Minutes" />
                  <div className="text-2xl md:text-4xl font-bold">:</div>
                  <CountdownUnit value={countdown.seconds} label="Seconds" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Discord join card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="w-full max-w-md border border-accent/30 shadow-xl overflow-hidden bg-card/90 backdrop-blur-sm" id="waitlist">
              <div className="absolute inset-0 bg-gradient-to-br from-careervision-500/5 to-insight-500/5 rounded-xl pointer-events-none"></div>
              <CardHeader className="text-center space-y-1 relative z-10">
                <CardTitle className="text-2xl">Join Our Discord Community</CardTitle>
                <CardDescription>
                  Connect with like-minded professionals and get early access updates
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col items-center justify-center py-6 space-y-6">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                    className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 127.14 96.36" fill="#5865F2">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                  </motion.div>
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-medium">Be Part of the Community</h3>
                    <p className="text-muted-foreground">
                      Get exclusive updates, interact with the team, and connect with other career-focused professionals.
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                    <Button 
                      onClick={handleJoinDiscord}
                      className="w-full rounded-full shadow-md bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 hover:shadow-xl"
                      disabled={isJoining}
                    >
                      {isJoining ? 'Joining...' : 'Join Discord Server'} 
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="text-center text-xs text-muted-foreground border-t p-4 relative z-10 bg-card/50">
                <div className="flex items-center justify-center space-x-1 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M11.5 2.3a2 2 0 0 1 2 0l6 3.57a2 2 0 0 1 1 1.74v7.02a5 5 0 0 1-2.17 4.11l-5.93 3.82a2 2 0 0 1-2.12-.05l-4.45-3.2a5 5 0 0 1-2.03-4.12V7.12a2 2 0 0 1 .5-1.31L11.5 2.3z"/><path d="m9 12 2 2 4-4"/></svg>
                  <span>Our Discord server is a safe and welcoming community.</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Premium features section */}
          <div className="mt-24 w-full max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Premium Career Intelligence</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">CareerVision offers powerful tools to help you make data-driven career decisions with confidence.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="features">
              <FeatureCard 
                title="Market Intelligence" 
                description="Real-time job market trends, demand forecasts, and salary insights tailored to your career path." 
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                gradient="bg-gradient-to-br from-careervision-500 to-careervision-600"
                delay={0}
              />
              <FeatureCard 
                title="Skill Analytics" 
                description="Identify skill gaps compared to market demands and get personalized learning recommendations." 
                icon={<BarChart2 className="h-6 w-6 text-white" />}
                gradient="bg-gradient-to-br from-insight-500 to-insight-600"
                delay={1}
              />
              <FeatureCard 
                title="Career Pathfinder" 
                description="Visualize optimal career paths based on your experience, skills, and market opportunities." 
                icon={<LineChart className="h-6 w-6 text-white" />}
                gradient="bg-gradient-to-br from-careervision-500 to-insight-500"
                delay={2}
              />
            </div>
          </div>
          
          {/* Final CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Don't Miss Out</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">Join our Discord community today to stay updated and connect with like-minded professionals.</p>
            <motion.a 
              href="#waitlist" 
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="rounded-full px-8 py-6 text-lg shadow-lg bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600 transition-all duration-300 hover:shadow-xl">
                Join Discord Community <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Waitlist; 