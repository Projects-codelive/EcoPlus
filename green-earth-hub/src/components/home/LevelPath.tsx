import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LEVEL_THRESHOLDS, getUserLevel } from '@/utils/levelUtils';

// Mock points - ideally this comes from a user context
const MOCK_POINTS = 1890;

export const LevelPath = () => {
  const currentLevelData = getUserLevel(MOCK_POINTS);

  return (
    <div className="lisboa-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Your Journey</h2>
        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
          {MOCK_POINTS} Points
        </span>
      </div>

      {/* Horizontal Scrolling Path */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 max-w-[90vw] md:max-w-full">
        <div className="flex items-center gap-2 min-w-max pb-2">
          {LEVEL_THRESHOLDS.map((level, index) => {
            const isCompleted = level.level < currentLevelData.level;
            const isCurrent = level.level === currentLevelData.level;
            const isLocked = level.level > currentLevelData.level;

            return (
              <div key={level.level} className="flex items-center">
                {/* Level Node */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "level-node relative transition-all duration-300 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border-2",
                      isCompleted && "bg-success scale-90 border-success",
                      isCurrent && "current bg-white border-4 border-accent shadow-lg scale-110 z-10",
                      isLocked && "locked bg-muted text-muted-foreground border-muted"
                    )}
                  >
                    {isCompleted ? (
                      <Check size={20} strokeWidth={3} className="text-white" />
                    ) : isCurrent ? (
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img src={level.avatar} alt={level.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Lock size={18} strokeWidth={2.5} />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold whitespace-nowrap transition-colors",
                    isCurrent ? "text-accent scale-105" :
                      isCompleted ? "text-success" : "text-muted-foreground"
                  )}>
                    {level.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index < LEVEL_THRESHOLDS.length - 1 && (
                  <div
                    className={cn(
                      "h-1 w-6 mx-1 rounded-full",
                      isCompleted ? "bg-success" : "bg-muted"
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