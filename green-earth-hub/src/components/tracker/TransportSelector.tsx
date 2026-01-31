import { Bike, Train, Bus, Zap, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TransportType = 'bicycle' | 'train' | 'bus' | 'electric' | 'car';

interface TransportSelectorProps {
  selected: TransportType | null;
  onSelect: (type: TransportType) => void;
}

const transportOptions: { type: TransportType; icon: typeof Bike; label: string }[] = [
  { type: 'bicycle', icon: Bike, label: 'Bicycle' },
  { type: 'train', icon: Train, label: 'Train' },
  { type: 'bus', icon: Bus, label: 'Bus' },
  { type: 'electric', icon: Zap, label: 'Electric' },
  { type: 'car', icon: Car, label: 'Car' },
];

export const TransportSelector = ({ selected, onSelect }: TransportSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">Mode of Transport</label>
      <div className="flex justify-between gap-2">
        {transportOptions.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={cn(
              "transport-toggle flex-1 max-w-[64px]",
              selected === type && "active"
            )}
            title={label}
          >
            <Icon 
              size={24} 
              strokeWidth={2.5}
              className={cn(
                "transition-colors",
                selected === type ? "text-accent-foreground" : "text-foreground"
              )}
            />
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-sm text-muted-foreground text-center">
          Selected: <span className="font-semibold text-foreground capitalize">{selected}</span>
        </p>
      )}
    </div>
  );
};
