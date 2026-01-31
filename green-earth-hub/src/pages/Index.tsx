import { AppLayout } from '@/components/layout/AppLayout';
import { HeroCard } from '@/components/home/HeroCard';
import { LevelPath } from '@/components/home/LevelPath';
import { QuickStats } from '@/components/home/QuickStats';
import { TodayActions } from '@/components/home/TodayActions';

const Index = () => {
  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        <HeroCard />
        <LevelPath />
        <QuickStats />
        <TodayActions />
      </div>
    </AppLayout>
  );
};

export default Index;
