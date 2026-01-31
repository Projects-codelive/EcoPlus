import cityscapeHero from '@/assets/cityscape-hero.png';
import { getUserLevel } from '@/utils/levelUtils';
import { useAuth } from '@/context/AuthContext';

export const HeroCard = () => {
  const { user } = useAuth();

  // Fallback if user is loading or null
  const points = user?.points || 0;
  const fullName = user?.fullName || 'Guest';

  const userLevel = getUserLevel(points);

  return (
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
    </div>
  );
};