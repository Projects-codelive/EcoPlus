import { QuickAction } from '@/types/chat';
import { Leaf, Lightbulb, Car, Zap } from 'lucide-react';

interface QuickActionsProps {
    onActionClick: (prompt: string) => void;
}

const quickActions: QuickAction[] = [
    {
        id: 'carbon',
        label: 'Carbon Footprint',
        icon: 'leaf',
        prompt: 'How can I reduce my carbon footprint?'
    },
    {
        id: 'tips',
        label: 'Daily Tips',
        icon: 'lightbulb',
        prompt: 'Give me some daily eco-friendly tips'
    },
    {
        id: 'transport',
        label: 'Transportation',
        icon: 'car',
        prompt: 'What are sustainable transportation options?'
    },
    {
        id: 'energy',
        label: 'Energy Saving',
        icon: 'zap',
        prompt: 'How can I reduce my energy usage at home?'
    }
];

const iconMap = {
    leaf: Leaf,
    lightbulb: Lightbulb,
    car: Car,
    zap: Zap
};

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
    return (
        <div className="p-4 border-t border-border bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                    const Icon = iconMap[action.icon as keyof typeof iconMap];
                    return (
                        <button
                            key={action.id}
                            onClick={() => onActionClick(action.prompt)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium group"
                        >
                            <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-foreground text-xs">{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
