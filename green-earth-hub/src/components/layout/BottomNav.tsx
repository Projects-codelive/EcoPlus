import { Home, Leaf, BookOpen, Trophy, User, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Leaf, label: 'Track', path: '/track' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
  { icon: Trophy, label: 'Leaders', path: '/leaderboard' },
  { icon: MessageSquare, label: 'Social', path: '/social' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 pb-safe z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                size={24}
                strokeWidth={2.5}
                className="transition-transform duration-200"
                style={{
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                }}
              />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};