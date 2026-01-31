import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Activity, Heart, Eye, Zap } from 'lucide-react';

export const MetersSidebar: React.FC = () => {
  const { meters } = useGameStore();

  const renderMeter = (label: string, value: number, icon: React.ReactNode, color: string) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1 text-primary font-medium">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-64 bg-card shadow-xl rounded-r-3xl p-6 flex flex-col h-full z-20 border-r border-primary/10">
      <h2 className="text-xl font-bold text-primary mb-6 tracking-wider">STATUS</h2>

      {renderMeter('Awareness', meters.awareness, <Eye size={16} className="text-primary" />, 'bg-progress')}
      {renderMeter('Impact', meters.impact, <Zap size={16} className="text-primary" />, 'bg-progress')}
      {renderMeter('Empathy', meters.empathy, <Heart size={16} className="text-primary" />, 'bg-progress')}
      {renderMeter('Action', meters.action, <Activity size={16} className="text-primary" />, 'bg-progress')}

      <div className="mt-auto pt-6 border-t border-primary/10">
        <p className="text-xs text-primary/60 uppercase tracking-widest mb-2">Current Objective</p>
        <p className="text-sm text-primary italic">"Navigate the rising tides of Neovara."</p>
      </div>
    </div>
  );
};
