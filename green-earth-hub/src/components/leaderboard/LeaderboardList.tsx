import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/api';

interface User {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

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
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/users/leaderboard`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-3">
      {users.map((user, index) => {
        const rank = index + 1;
        const isCurrentUser = currentUser?.id === user.id; // Assuming auth user has id (check context)
        // Note: AuthContext usually provides user object with _id or id. Let's assume id based on typical usage or check AuthContext later if verification fails.
        // Actually, let's verify AuthContext structure or just check if user.name matches if id is missing in context type defs? 
        // Better: Assuming auth context user object has `id` property from my previous `verifyToken` /me response which returns { id, fullName... }

        return (
          <div
            key={user.id}
            className={cn(
              "leaderboard-row",
              isCurrentUser && "ring-2 ring-accent"
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
                isCurrentUser ? "text-coral" : "text-foreground"
              )}>
                {user.name}
              </span>
              {isCurrentUser && (
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
