import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CarbonGauge } from '@/components/tracker/CarbonGauge';
import { JourneyForm } from '@/components/tracker/JourneyForm';
import { WeeklyChart } from '@/components/tracker/WeeklyChart';

const TrackPage = () => {
  const [currentEmissions] = useState(120);
  const maxEmissions = 300;

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pt-2 pb-2">
          <h1 className="text-2xl font-bold text-foreground">Carbon Tracker</h1>
          <p className="text-muted-foreground">Monitor your environmental impact</p>
        </div>

        <CarbonGauge value={currentEmissions} maxValue={maxEmissions} />
        <JourneyForm />
        <WeeklyChart />
      </div>
    </AppLayout>
  );
};

export default TrackPage;
