import { Flame, Star, CloudOff } from 'lucide-react';

const stats = [
  { 
    icon: Flame, 
    value: '5', 
    label: 'Day Streak',
    color: 'text-coral'
  },
  { 
    icon: Star, 
    value: '1,200', 
    label: 'Points',
    color: 'text-lime'
  },
  { 
    icon: CloudOff, 
    value: '40kg', 
    label: 'CO₂ Saved',
    color: 'text-jungle'
  },
];

export const QuickStats = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="stat-card">
            <Icon 
              size={24} 
              strokeWidth={2.5}
              className={stat.color}
            />
            <span className="stat-value mt-2">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
};
