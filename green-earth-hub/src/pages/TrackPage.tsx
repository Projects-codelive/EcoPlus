import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CarbonGauge } from '@/components/tracker/CarbonGauge';
import { JourneyForm } from '@/components/tracker/JourneyForm';
import { WeeklyChart } from '@/components/tracker/WeeklyChart';

const TrackPage = () => {
  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [liveEstimate, setLiveEstimate] = useState(0); // Real-time estimate from form
  const maxEmissions = 15; // Range 0-15kg as requested

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/journey/stats', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentEmissions(data.totalEmissions);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleJourneySaved = () => {
    fetchStats(); // Update total from backend
    setLiveEstimate(0); // Reset live estimate
  };

  // The gauge shows: Just the current estimated journey (starts at 0)
  const displayedEmissions = liveEstimate;

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pt-2 pb-2">
          <h1 className="text-2xl font-bold text-foreground">Carbon Tracker</h1>
          <p className="text-muted-foreground">Monitor your environmental impact</p>
        </div>

        <CarbonGauge value={displayedEmissions} maxValue={maxEmissions} />
        <JourneyForm
          onEmissionChange={setLiveEstimate}
          onJourneySaved={handleJourneySaved}
        />
        <WeeklyChart />
      </div>
    </AppLayout>
  );
};

export default TrackPage;
