import cityscapeHero from '@/assets/cityscape-hero.png';

export const HeroCard = () => {
  return (
    <div className="lisboa-card overflow-hidden">
      {/* Hero Image */}
      <div className="relative -mx-6 -mt-6 mb-4">
        <img 
          src={cityscapeHero} 
          alt="Sustainable cityscape" 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      
      {/* Welcome Text */}
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm font-medium">Welcome back</p>
        <h1 className="text-2xl font-bold text-foreground">
          Hello, Team Runtime 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Ready to make a difference today?
        </p>
      </div>
    </div>
  );
};
