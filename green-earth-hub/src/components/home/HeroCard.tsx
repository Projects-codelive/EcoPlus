import { useState } from 'react';
import cityscapeHero from '@/assets/cityscape-hero.png';
import { getUserLevel } from '@/utils/levelUtils';
import { useAuth } from '@/context/AuthContext';
import { Gamepad2, X, Sparkles } from 'lucide-react';
import { GameContainer } from '@/components/GameContainer';

export const HeroCard = () => {
  const { user } = useAuth();
  const [showGame, setShowGame] = useState(false);

  // Fallback if user is loading or null
  const points = user?.points || 0;
  const fullName = user?.fullName || 'Guest';

  const userLevel = getUserLevel(points);

  return (
    <>
      <div className="lisboa-card overflow-hidden">
        {/* Hero Image */}
        <div className="relative -mx-6 -mt-6 mb-4">
          <img
            src={cityscapeHero}
            alt="Sustainable cityscape"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

          {/* Floating Avatar */}
          <div className="absolute -bottom-6 left-6 flex items-end">
            <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
              <img
                src={userLevel.avatar}
                alt={userLevel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mb-2 ml-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-xs font-bold text-accent border border-white/50">
              {userLevel.name}
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="pt-6 space-y-1">
          <p className="text-muted-foreground text-sm font-medium">Welcome back</p>
          <h1 className="text-2xl font-bold text-foreground">
            Hello, {fullName} 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            You're crushing it with <span className="font-bold text-accent">{points} points!</span>
          </p>
        </div>

        {/* Glowing Game Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowGame(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.3)'
            }}
          >
            {/* Animated glow effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
              style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
            />

            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />

            {/* Button content */}
            <div className="relative flex items-center gap-3 justify-center">
              <Sparkles size={20} className="animate-pulse" />
              <Gamepad2 size={24} className="animate-bounce" />
              <span className="tracking-wide">Play Eco Game</span>
              <Gamepad2 size={24} className="animate-bounce" style={{ animationDelay: '0.2s' }} />
              <Sparkles size={20} className="animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </button>
        </div>
      </div>

      {/* Game Modal */}
      {showGame && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            onClick={() => setShowGame(false)}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Close game"
          >
            <X size={24} />
          </button>

          {/* Game Container */}
          <div className="w-full h-full">
            <GameContainer />
          </div>
        </div>
      )}
    </>
  );
};