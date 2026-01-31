import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface ActivityLogItem {
    date: string; // YYYY-MM-DD
    count: number;
}

interface ActivityHeatmapProps {
    activityLog: ActivityLogItem[];
}

const ActivityHeatmap = ({ activityLog = [] }: ActivityHeatmapProps) => {
    // Generate last 365 days (or approx 1 year grid)
    const today = new Date();
    const days = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const activity = activityLog.find(log => log.date === dateStr);
        days.push({
            date: dateStr,
            count: activity ? activity.count : 0,
            level: activity ? Math.min(4, Math.ceil(activity.count / 2)) : 0 // 0-4 intensity
        });
    }

    const getIntensityClass = (level: number) => {
        switch (level) {
            case 0: return 'bg-gray-100 hover:bg-gray-200';
            case 1: return 'bg-green-200 hover:bg-green-300';
            case 2: return 'bg-green-400 hover:bg-green-500';
            case 3: return 'bg-green-600 hover:bg-green-700';
            case 4: return 'bg-green-800 hover:bg-green-900';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="lisboa-card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">Activity Log</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info size={16} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Your daily activity intensity</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Scrollable container for mobile */}
            <div className="overflow-x-auto pb-2">
                <div className="flex gap-1 min-w-max">
                    {/* Simple Grid: 7 rows (days of week) -> 52 columns */}
                    {/* Group days by weeks for easier column rendering */}
                    {Array.from({ length: 53 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                                const dayData = days[weekIndex * 7 + dayIndex];
                                if (!dayData) return null;
                                return (
                                    <TooltipProvider key={dayData.date}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div
                                                    className={cn(
                                                        "w-3 h-3 rounded-[2px] transition-colors cursor-pointer",
                                                        getIntensityClass(dayData.level)
                                                    )}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs font-bold">{dayData.date}: {dayData.count} activities</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-[2px] bg-gray-100"></div>
                    <div className="w-3 h-3 rounded-[2px] bg-green-200"></div>
                    <div className="w-3 h-3 rounded-[2px] bg-green-400"></div>
                    <div className="w-3 h-3 rounded-[2px] bg-green-600"></div>
                    <div className="w-3 h-3 rounded-[2px] bg-green-800"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
