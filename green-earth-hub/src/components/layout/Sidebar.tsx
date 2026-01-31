import { Home, Leaf, BookOpen, Trophy, User, Map } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { getUserLevel } from '@/utils/levelUtils';

const MOCK_POINTS = 1890;

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Leaf, label: 'Track', path: '/track' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
  { icon: Trophy, label: 'Leaders', path: '/leaderboard' },
];

export const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  // userLevel is no longer used after removing the user info div
  // const userLevel = getUserLevel(MOCK_POINTS);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 relative z-50 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        {!collapsed && <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate">Ec0Saga</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <div className="w-4 h-4 rounded-full border-2 border-current" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-current" />
          )}
          {/* Using a simple visual indicator for toggle, or could use ChevronLeft/Right icons if imported */}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(
                  "transition-transform duration-200",
                  isActive && !collapsed && "scale-110"
                )}
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md border border-border">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Optional User Info or Footer at bottom */}
      {/* The user info div has been removed as per instruction */}
    </aside>
  );
};