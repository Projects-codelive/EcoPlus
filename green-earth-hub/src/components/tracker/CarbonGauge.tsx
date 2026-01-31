import { useMemo } from 'react';

interface CarbonGaugeProps {
  value: number;
  maxValue: number;
}

export const CarbonGauge = ({ value, maxValue }: CarbonGaugeProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  // Calculate the arc path
  const radius = 120;
  const strokeWidth = 20;
  const startAngle = -180;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle;
  const progressAngle = startAngle + (totalAngle * percentage / 100);
  
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };
  
  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(cx, cy, r, start);
    const endPoint = polarToCartesian(cx, cy, r, end);
    const largeArcFlag = end - start <= 180 ? 0 : 1;
    
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`;
  };

  const cx = 150;
  const cy = 140;
  
  // Color based on value
  const getColor = useMemo(() => {
    if (percentage <= 33) return 'hsl(82 78% 44%)'; // Lime/Green
    if (percentage <= 66) return 'hsl(45 93% 47%)'; // Yellow
    return 'hsl(0 84% 60%)'; // Red
  }, [percentage]);

  return (
    <div className="lisboa-card">
      <h2 className="text-lg font-bold text-foreground mb-2">Your Carbon Footprint</h2>
      <p className="text-sm text-muted-foreground mb-4">This month's emissions</p>
      
      <div className="relative flex justify-center">
        <svg width="300" height="160" viewBox="0 0 300 160">
          {/* Background Arc */}
          <path
            d={describeArc(cx, cy, radius, startAngle, endAngle)}
            fill="none"
            stroke="hsl(138 50% 92%)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress Arc */}
          <path
            d={describeArc(cx, cy, radius, startAngle, progressAngle)}
            fill="none"
            stroke={getColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
            }}
          />
          
          {/* Scale markers */}
          {[0, 25, 50, 75, 100].map((mark) => {
            const angle = startAngle + (totalAngle * mark / 100);
            const outer = polarToCartesian(cx, cy, radius + 25, angle);
            return (
              <text
                key={mark}
                x={outer.x}
                y={outer.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs font-medium"
              >
                {Math.round(maxValue * mark / 100)}
              </text>
            );
          })}
        </svg>
        
        {/* Center Value */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <span className="text-4xl font-bold text-foreground">{value}</span>
          <span className="text-lg text-muted-foreground ml-1">kg</span>
          <p className="text-sm text-muted-foreground">CO₂</p>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-lime" />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
};
