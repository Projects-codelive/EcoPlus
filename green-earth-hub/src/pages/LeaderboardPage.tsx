import { AppLayout } from '@/components/layout/AppLayout';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';
import { BadgeGrid } from '@/components/leaderboard/BadgeGrid';
import { Trophy, Award } from 'lucide-react';

const LeaderboardPage = () => {
  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pt-2 pb-2">
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">Compete with other eco warriors</p>
        </div>

        {/* Leaderboard Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Trophy size={20} strokeWidth={2.5} className="text-coral" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Top Performers</h2>
            <p className="text-sm text-muted-foreground">This month's rankings</p>
          </div>
        </div>

        <LeaderboardList />

        {/* Badges Section */}
        <div className="flex items-center gap-3 mb-2 mt-6">
          <div className="w-10 h-10 rounded-2xl bg-success/20 flex items-center justify-center">
            <Award size={20} strokeWidth={2.5} className="text-lime" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Your Badges</h2>
            <p className="text-sm text-muted-foreground">Achievements unlocked</p>
          </div>
        </div>

        <BadgeGrid />
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
