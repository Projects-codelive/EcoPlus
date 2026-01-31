import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const levels = [
  { id: 1, name: 'Novice', completed: true },
  { id: 2, name: 'Scout', completed: true },
  { id: 3, name: 'Guardian', completed: false, current: true },
  { id: 4, name: 'Champion', completed: false },
  { id: 5, name: 'Hero', completed: false },
  { id: 6, name: 'Legend', completed: false },
];

export const LevelPath = () => {
  return (
    <div className="lisboa-card">
      <h2 className="text-lg font-bold text-foreground mb-4">Your Journey</h2>
      
      {/* Horizontal Scrolling Path */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex items-center gap-2 min-w-max pb-2">
          {levels.map((level, index) => (
            <div key={level.id} className="flex items-center">
              {/* Level Node */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "level-node",
                    level.completed && "bg-success",
                    level.current && "current bg-accent",
                    !level.completed && !level.current && "locked"
                  )}
                >
                  {level.completed ? (
                    <Check size={24} strokeWidth={3} />
                  ) : level.current ? (
                    <span>{level.id}</span>
                  ) : (
                    <Lock size={20} strokeWidth={2.5} />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-semibold whitespace-nowrap",
                  level.current ? "text-coral" : 
                  level.completed ? "text-foreground" : "text-muted-foreground"
                )}>
                  {level.name}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < levels.length - 1 && (
                <div 
                  className={cn(
                    "h-1 w-8 mx-2 rounded-full",
                    levels[index + 1].completed || levels[index + 1].current
                      ? "bg-success"
                      : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};