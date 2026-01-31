import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HeroCard } from '@/components/home/HeroCard';
import { LevelPath } from '@/components/home/LevelPath';
import { QuickStats } from '@/components/home/QuickStats';
import { TodayActions } from '@/components/home/TodayActions';
import { API_BASE } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalEmissions: 0, totalSaved: 0 });
  const [activityData, setActivityData] = useState({ streak: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/journey/stats`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchActivityData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/activity/data`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setActivityData(data);
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };

    fetchStats();
    fetchActivityData();
  }, []);

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        <HeroCard />
        <LevelPath />
        <QuickStats
          points={user?.points || 0}
          streak={activityData.streak}
          co2Saved={stats.totalSaved}
        />
        <TodayActions />
      </div>
    </AppLayout>
  );
};

export default Index;
