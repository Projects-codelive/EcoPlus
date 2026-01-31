import { cn } from '@/lib/utils';
import { Leaf, Bike, Zap, Recycle, TreePine, Award } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon: typeof Leaf;
  unlocked: boolean;
  description: string;
}

const badges: Badge[] = [
  { id: 'eco-starter', name: 'Eco Starter', icon: Leaf, unlocked: true, description: 'Complete your first week' },
  { id: 'bike-master', name: 'Bike Master', icon: Bike, unlocked: true, description: '50km by bicycle' },
  { id: 'energy-saver', name: 'Energy Saver', icon: Zap, unlocked: true, description: 'Save 10kg CO₂' },
  { id: 'recycler', name: 'Recycler', icon: Recycle, unlocked: false, description: 'Complete recycling quiz' },
  { id: 'tree-planter', name: 'Tree Planter', icon: TreePine, unlocked: false, description: 'Offset 100kg CO₂' },
  { id: 'eco-warrior', name: 'Eco Warrior', icon: Award, unlocked: false, description: 'Reach Level 5' },
];

export const BadgeGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {badges.map((badge) => {
        const Icon = badge.icon;
        
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className={cn(
              "badge-circle",
              !badge.unlocked && "locked"
            )}>
              <Icon 
                size={32} 
                strokeWidth={2} 
                className="text-white"
              />
            </div>
            <span className={cn(
              "text-xs font-semibold",
              badge.unlocked ? "text-foreground" : "text-muted-foreground"
            )}>
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
