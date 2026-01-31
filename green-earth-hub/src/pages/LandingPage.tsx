import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, Users, Sparkles } from 'lucide-react';


import { useAuth } from '@/context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden font-sans">

      {/* --- 1. BACKGROUND VIDEO LAYER --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Ensure the file is in your 'public' folder named 'hero-bg.mp4' */}
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* --- 2. GLASS OVERLAY (Keeps text readable) --- */}
        {/* We use white with 70% opacity so the green animation shows through but text pops */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
      </div>

      {/* --- 3. MAIN CONTENT (Your Code) --- */}
      {/* Added 'relative z-10' to sit on top of video */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Logo/Icon */}
        <div className="mb-8 animate-float">
          <div className="w-24 h-24 rounded-full bg-[#14532D]/10 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg">
            <Leaf size={48} strokeWidth={2.5} className="text-[#15803D]" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-[#064E3B] text-center mb-6 leading-tight drop-shadow-sm">
          Small Habits,<br />
          <span className="text-[#FB923C]">Big Impact</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-[#15803D] font-medium text-center max-w-md mb-10 leading-relaxed">
          Join Team Runtime in the fight against climate change.
        </p>

        {/* CTA Button */}
        <Link
          to="/login"
          className="bg-[#FB923C] hover:bg-[#F97316] text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Get Started
        </Link>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full shadow-sm border border-white/50">
            <TrendingUp size={18} strokeWidth={2.5} className="text-[#84CC16]" />
            <span className="text-sm font-bold text-[#064E3B]">Track Carbon</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full shadow-sm border border-white/50">
            <Users size={18} strokeWidth={2.5} className="text-[#FB923C]" />
            <span className="text-sm font-bold text-[#064E3B]">Compete</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full shadow-sm border border-white/50">
            <Sparkles size={18} strokeWidth={2.5} className="text-[#84CC16]" />
            <span className="text-sm font-bold text-[#064E3B]">Earn Badges</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-sm text-[#064E3B]/60 font-medium">
          ClimateChange+ by Team Runtime
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;