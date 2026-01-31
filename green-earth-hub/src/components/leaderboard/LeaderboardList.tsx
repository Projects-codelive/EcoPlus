import { cn } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  avatar: string;
  score: number;
  isCurrentUser?: boolean;
}

const users: User[] = [
  { id: 1, name: 'Sarah Green', avatar: '🌿', score: 2450 },
  { id: 2, name: 'Team Runtime', avatar: '⚡', score: 1890, isCurrentUser: true },
  { id: 3, name: 'EcoWarrior42', avatar: '🌍', score: 1654 },
  { id: 4, name: 'GreenThumb', avatar: '🌱', score: 1432 },
  { id: 5, name: 'BikeLife', avatar: '🚴', score: 1298 },
  { id: 6, name: 'SolarPower', avatar: '☀️', score: 1156 },
  { id: 7, name: 'TreeHugger', avatar: '🌳', score: 1023 },
  { id: 8, name: 'RecycleKing', avatar: '♻️', score: 876 },
];

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `#${rank}`;
  }
};

export const LeaderboardList = () => {
  return (
    <div className="space-y-3">
      {users.map((user, index) => {
        const rank = index + 1;
        
        return (
          <div
            key={user.id}
            className={cn(
              "leaderboard-row",
              user.isCurrentUser && "ring-2 ring-accent"
            )}
          >
            {/* Rank */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
              rank <= 3 ? "text-2xl" : "bg-muted text-muted-foreground"
            )}>
              {getRankBadge(rank)}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-xl">
              {user.avatar}
            </div>

            {/* Name */}
            <div className="flex-1">
              <span className={cn(
                "font-semibold",
                user.isCurrentUser ? "text-coral" : "text-foreground"
              )}>
                {user.name}
              </span>
              {user.isCurrentUser && (
                <span className="ml-2 text-xs text-coral font-medium">(You)</span>
              )}
            </div>

            {/* Score */}
            <div className="text-right">
              <span className="font-bold text-foreground">{user.score.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground ml-1">pts</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
