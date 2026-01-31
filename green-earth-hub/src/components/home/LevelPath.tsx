import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LEVEL_THRESHOLDS, getUserLevel } from '@/utils/levelUtils';
import { useAuth } from '@/context/AuthContext';

export const LevelPath = () => {
  const { user } = useAuth();
  const points = user?.points || 0;
  const currentLevelData = getUserLevel(points);

  return (
    <div className="lisboa-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Your Journey</h2>
        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
          {points} Points
        </span>
      </div>

      {/* Horizontal Scrolling Path */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 py-4">
        <div className="flex items-center gap-6 min-w-max">
          {LEVEL_THRESHOLDS.map((level, index) => {
            const isCompleted = level.level < currentLevelData.level;
            const isCurrent = level.level === currentLevelData.level;
            const isLocked = level.level > currentLevelData.level;

            return (
              <div key={level.level} className="flex items-center">
                {/* Level Node */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all duration-500",
                      // Base styles
                      "w-16 h-16",

                      // State styles
                      isCompleted && "bg-success text-white shadow-md scale-90",

                      // Current (Active) styles
                      isCurrent && "w-20 h-20 bg-white border-4 border-accent shadow-[0_0_20px_rgba(251,146,60,0.4)] scale-110 z-10",

                      // Locked styles
                      isLocked && "bg-muted text-muted-foreground border-2 border-transparent"
                    )}
                  >
                    {isCompleted ? (
                      <Check size={28} strokeWidth={3} className="text-white" />
                    ) : isCurrent ? (
                      <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-white">
                        <img
                          src={level.avatar}
                          alt={level.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <Lock size={20} strokeWidth={2} />
                    )}
                  </div>

                  {/* Label */}
                  <span className={cn(
                    "text-xs font-bold whitespace-nowrap px-3 py-1 rounded-full transition-all duration-300",
                    isCurrent ? "text-white bg-accent shadow-md transform -translate-y-1" :
                      isCompleted ? "text-success font-semibold" : "text-muted-foreground"
                  )}>
                    {level.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index < LEVEL_THRESHOLDS.length - 1 && (
                  <div
                    className={cn(
                      "h-1.5 w-12 rounded-full mx-2 transition-colors duration-500",
                      isCompleted ? "bg-success/50" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};