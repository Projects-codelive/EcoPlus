import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const weeklyData = [
  { day: 'Mon', value: 4.2 },
  { day: 'Tue', value: 2.8 },
  { day: 'Wed', value: 5.1 },
  { day: 'Thu', value: 3.5 },
  { day: 'Fri', value: 6.2 },
  { day: 'Sat', value: 1.2 },
  { day: 'Sun', value: 0.8 },
];

export const WeeklyChart = () => {
  const average = weeklyData.reduce((sum, d) => sum + d.value, 0) / weeklyData.length;

  return (
    <div className="lisboa-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">This Week</h2>
          <p className="text-sm text-muted-foreground">Daily CO₂ emissions</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            {weeklyData.reduce((sum, d) => sum + d.value, 0).toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">kg total</p>
        </div>
      </div>

      <div className="h-48 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barCategoryGap="20%">
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(162 40% 35%)', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis hide />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 8, 8]}
            >
              {weeklyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.value > average ? 'hsl(27 97% 61%)' : 'hsl(82 78% 44%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-lime" />
          <span className="text-xs text-muted-foreground">Below avg</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-coral" />
          <span className="text-xs text-muted-foreground">Above avg</span>
        </div>
      </div>
    </div>
  );
};
