
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <Hero />
        <Features />
      </div>
    </div>
  );
};

export default Index;
