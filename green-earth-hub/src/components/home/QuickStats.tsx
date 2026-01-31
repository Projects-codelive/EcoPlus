import { Flame, Star, CloudOff } from 'lucide-react';

interface QuickStatsProps {
  points: number;
  streak: number;
  co2Saved: number;
}

export const QuickStats = ({ points, streak, co2Saved }: QuickStatsProps) => {
  const stats = [
    {
      icon: Flame,
      value: streak.toString(),
      label: 'Day Streak',
      color: 'text-coral'
    },
    {
      icon: Star,
      value: points.toLocaleString(),
      label: 'Points',
      color: 'text-lime'
    },
    {
      icon: CloudOff,
      value: `${co2Saved}kg`,
      label: 'CO₂ Saved',
      color: 'text-jungle'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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