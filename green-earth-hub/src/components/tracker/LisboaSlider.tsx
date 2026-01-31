import { useState, useCallback } from 'react';

interface LisboaSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}

export const LisboaSlider = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  unit, 
  onChange 
}: LisboaSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <span className="text-sm font-bold text-foreground">
          {value} <span className="text-muted-foreground font-normal">{unit}</span>
        </span>
      </div>
      
      <div className="relative">
        {/* Track Background */}
        <div className="slider-lisboa">
          {/* Filled Track */}
          <div 
            className="track" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        
        {/* Native Range Input (invisible, for accessibility) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* Custom Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-card rounded-full pointer-events-none transition-transform"
          style={{ 
            left: `calc(${percentage}% - 12px)`,
            boxShadow: isDragging 
              ? '0 4px 14px hsl(162 89% 16% / 0.3)' 
              : '0 2px 8px hsl(162 89% 16% / 0.2)',
            transform: `translateY(-50%) scale(${isDragging ? 1.1 : 1})`,
          }}
        />
      </div>
      
      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
