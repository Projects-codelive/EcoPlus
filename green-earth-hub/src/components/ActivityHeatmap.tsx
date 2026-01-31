import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityLogItem {
    date: string;
    count: number;
}

interface HeatmapProps {
    activityLog?: ActivityLogItem[];
}

const ActivityHeatmap: React.FC<HeatmapProps> = ({ activityLog = [] }) => {
    // Generate last 6 months of dates
    const generateDateGrid = () => {
        const months = [];
        const today = new Date();

        // Go back 6 months
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
                year: monthDate.getFullYear(),
                monthIndex: monthDate.getMonth()
            });
        }

        return months;
    };

    // Format date as YYYY-MM-DD in local time (matches backend streak day)
    const toLocalDateString = (date: Date): string => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Get activity level for a specific date (0 = none, 1 = low, 2 = medium, 3 = high)
    const getActivityLevel = (date: Date): number => {
        const dateStr = toLocalDateString(date);
        const activity = activityLog.find(log => log.date === dateStr);
        if (!activity) return 0;
        const count = activity.count ?? 0;
        if (count >= 5) return 3; // Adjusted for "count" vs points
        if (count >= 2) return 2;
        return 1;
    };

    // Generate weeks for a month
    const getWeeksInMonth = (year: number, month: number) => {
        const weeks: Date[][] = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let currentWeek: Date[] = [];

        // Fill in days from previous month if needed
        const startDayOfWeek = firstDay.getDay();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            currentWeek.push(date);
        }

        // Add all days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            currentWeek.push(date);

            if (date.getDay() === 6 || day === lastDay.getDate()) {
                // End of week or end of month
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        }

        return weeks;
    };

    const months = generateDateGrid();
    // We use just the first letter for the side labels to save space or match compact design better
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Row height and gap must match between labels and grid
    // Using rounded-full for circles as per previous design request
    const cellSize = 'w-3 h-3';
    const rowGap = 'gap-1';

    return (
        <div className="lisboa-card border border-border bg-card text-card-foreground shadow-sm p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-foreground text-emerald-900 dark:text-emerald-100">Activity Heatmap</h3>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="inline-flex gap-4 items-start">
                    {/* Weekday labels */}
                    <div className={`flex flex-col ${rowGap} text-[10px] font-medium text-muted-foreground pr-2 shrink-0 pt-6`}>
                        {/* The month header is approx h-[1.25rem] + mb-2, so we pad top to align weeks? 
                 Actually the month loop has separate headers. We just need to align rows.
                 The months have a header. We should spacer.
             */}
                        {/* <div className="min-h-[1.25rem] mb-2" /> */}
                        {['Mon', 'Wed', 'Fri'].map((day, i) => (
                            // Visual hacking to match GitHub style skipping? 
                            // The user's code had all days. Let's stick to user code but refined.
                            // User's code labels: M, T, W, T, F, S, S? 
                            // GitHub usually does Mon/Wed/Fri.
                            // Let's print all 7 but small.
                            null
                        ))}
                        {/* Let's strictly follow the user's provided structure for labels but styled */}
                        {weekdays.map((day, i) => (
                            // Only show alternate days to declutter if desired, or all. 
                            // Let's show all for now as per user code logic.
                            <div
                                key={i}
                                className="h-3 flex items-center justify-end leading-none text-right"
                            >
                                {/* {i % 2 !== 0 ? day : ''} */}
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Month columns */}
                    {months.map((month) => {
                        const weeks = getWeeksInMonth(month.year, month.monthIndex);

                        return (
                            <div key={`${month.year}-${month.monthIndex}`} className="flex flex-col shrink-0">
                                <div className="text-xs text-muted-foreground mb-2 text-center font-medium min-h-[1.25rem] flex items-center justify-center">
                                    {month.name}
                                </div>

                                <div className={`flex ${rowGap}`}>
                                    {weeks.map((week, weekIdx) => (
                                        <div key={`${month.monthIndex}-${weekIdx}`} className={`flex flex-col ${rowGap}`}>
                                            {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
                                                const date = week[dayIdx];
                                                // Placeholder for alignment if the week array is partial?
                                                // The logic provided fills weeks fully or partially.
                                                // We need to handle undefined if logic is loose.
                                                if (!date) {
                                                    return <div key={dayIdx} className={`${cellSize} rounded-full bg-transparent`} />;
                                                }

                                                const isCurrentMonth = date.getMonth() === month.monthIndex;
                                                const level = getActivityLevel(date);
                                                const isToday = date.toDateString() === new Date().toDateString();

                                                // Colors
                                                let bgColor = 'bg-muted/40';
                                                if (level >= 3) bgColor = 'bg-emerald-600';
                                                else if (level === 2) bgColor = 'bg-emerald-400';
                                                else if (level === 1) bgColor = 'bg-emerald-200';

                                                // Dim days not in current month
                                                if (!isCurrentMonth) bgColor = 'bg-muted/10 opacity-30';

                                                return (
                                                    <TooltipProvider key={dayIdx}>
                                                        <Tooltip delayDuration={0}>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className={cn(
                                                                        cellSize,
                                                                        "rounded-full transition-all duration-300 cursor-pointer",
                                                                        bgColor,
                                                                        isToday ? 'ring-2 ring-emerald-500 ring-offset-1' : 'hover:ring-2 hover:ring-emerald-200 hover:ring-offset-1'
                                                                    )}
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {date.toLocaleDateString()}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-3 mt-4 text-xs font-medium text-muted-foreground pl-2">
                <span>Less</span>
                <div className="flex gap-1 items-center">
                    <div className="w-3 h-3 rounded-full bg-muted/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-200" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-600" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
