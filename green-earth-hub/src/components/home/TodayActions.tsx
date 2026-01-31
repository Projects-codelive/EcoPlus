import { ArrowRight, Leaf, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  {
    icon: Leaf,
    title: 'Log a Journey',
    description: 'Track your daily commute',
    path: '/track',
    color: 'bg-lime/20 text-jungle',
  },
  {
    icon: BookOpen,
    title: 'Daily Quiz',
    description: 'Earn 50 bonus points',
    path: '/learn',
    color: 'bg-accent/20 text-coral',
  },
  {
    icon: Target,
    title: 'Set a Goal',
    description: 'Reduce 10kg this week',
    path: '/profile',
    color: 'bg-primary/10 text-jungle',
  },
];

export const TodayActions = () => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-foreground px-1">Today's Actions</h2>
      
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.title}
            to={action.path}
            className="lisboa-card-soft flex items-center gap-4 group hover:shadow-card transition-shadow duration-300"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color}`}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
            <ArrowRight 
              size={20} 
              className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all"
            />
          </Link>
        );
      })}
    </div>
  );
};
