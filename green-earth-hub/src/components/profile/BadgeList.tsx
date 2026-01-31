import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const BADGES_CONFIG = [
    {
        id: 1,
        name: 'Seed Planter',
        icon: '🌱',
        description: 'Complete your very first climate quiz.',
    },
    {
        id: 2,
        name: 'Climate Scholar',
        icon: '📚',
        description: 'Complete 3 quizzes on Climate Science.',
    },
    {
        id: 3,
        name: 'Ocean Defender',
        icon: '🌊',
        description: 'Score 80%+ in an Oceans & Water quiz.',
    },
    {
        id: 4,
        name: 'Green Genius',
        icon: '🧠',
        description: 'Complete any quiz with an average score of 90% or higher.',
    },
    {
        id: 5,
        name: 'Habit Hero',
        icon: '♻️',
        description: 'Engage with the platform on 3 different days.',
    },
    {
        id: 6,
        name: 'Change Maker',
        icon: '🌍',
        description: 'Complete 10 unique lessons or quizzes.',
    },
    {
        id: 7,
        name: 'Net Zero Hero',
        icon: '🦸',
        description: 'Achieve a perfect score (100%) in any quiz.',
    },
    {
        id: 8,
        name: 'Nocturnal Nature',
        icon: '🦉',
        description: 'Complete a learning module after 10 PM.',
    },
];

interface BadgeListProps {
    earnedBadges: string[];
}

export function BadgeList({ earnedBadges = [] }: BadgeListProps) {
    return (
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-4 p-4">
            {BADGES_CONFIG.map((badge) => {
                const isEarned = earnedBadges.includes(badge.name);

                return (
                    <TooltipProvider key={badge.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={cn(
                                    "relative flex items-center justify-center p-0.5  rounded-full border-2 transition-all duration-300 aspect-square text-center shadow-md cursor-pointer",
                                    isEarned
                                        ? "bg-gradient-to-br from-accent/20 to-accent/5 border-accent/40 hover:scale-105 hover:shadow-lg"
                                        : "bg-muted/20 border-muted/40 grayscale opacity-50 hover:opacity-70"
                                )}>
                                    <span className="text-4xl filter drop-shadow-md select-none">{badge.icon}</span>
                                    {!isEarned && (
                                        <div className="absolute -top-1 -right-1 bg-background rounded-full p-1 border-2 border-muted shadow-sm">
                                            <Lock size={12} className="text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-center space-y-1">
                                    <p className="font-bold">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground max-w-[150px]">{badge.description}</p>
                                    <p className={cn("text-xs font-semibold mt-1", isEarned ? "text-green-500" : "text-amber-500")}>
                                        {isEarned ? "Earned!" : "Locked"}
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            })}
        </div>
    );
}
