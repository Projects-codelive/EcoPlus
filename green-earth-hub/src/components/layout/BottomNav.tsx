import { Home, Leaf, BookOpen, Trophy, User, MessageSquare, Map } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Leaf, label: 'Track', path: '/track' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: Trophy, label: 'Leaders', path: '/leaderboard' },
  { icon: MessageSquare, label: 'Social', path: '/social' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 pb-safe z-[100] md:hidden shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between py-2 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[3.5rem] p-1.5 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span className={cn(
                "text-[10px] font-medium leading-tight",
                isActive ? "font-semibold" : ""
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};