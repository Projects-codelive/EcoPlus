import { Lightbulb, Leaf, Droplets, Zap, Recycle, Wind } from 'lucide-react';
import { useRef } from 'react';

const tips = [
  {
    icon: Lightbulb,
    title: "Switch to LED",
    description: "LED bulbs use 75% less energy than traditional incandescent lights.",
    color: "bg-yellow-400/20 text-yellow-600",
  },
  {
    icon: Leaf,
    title: "Eat Plant-Based",
    description: "One meatless day per week can save 1,500 liters of water.",
    color: "bg-success/20 text-jungle",
  },
  {
    icon: Droplets,
    title: "Shorter Showers",
    description: "Reducing shower time by 2 minutes saves 40 liters of water daily.",
    color: "bg-blue-400/20 text-blue-600",
  },
  {
    icon: Zap,
    title: "Unplug Devices",
    description: "Standby power accounts for 10% of your home's energy use.",
    color: "bg-accent/20 text-coral",
  },
  {
    icon: Recycle,
    title: "Recycle Right",
    description: "Proper recycling can reduce CO₂ emissions by 1.4 tonnes per year.",
    color: "bg-primary/10 text-jungle",
  },
  {
    icon: Wind,
    title: "Air Dry Clothes",
    description: "Skip the dryer once a week and save 150 kg CO₂ annually.",
    color: "bg-cyan-400/20 text-cyan-600",
  },
];

export const TipsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-x-auto overflow-y-hidden scrollbar-hide -mx-4 px-4" ref={scrollRef}>
      <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="lisboa-card-soft w-64 flex-shrink-0 space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tip.color}`}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-foreground">{tip.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
