import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { useAuth } from '@/context/AuthContext';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { getUserLevel } from '@/utils/levelUtils';

interface AppLayoutProps {
  children: ReactNode;
}

const Header = () => {
  const { user } = useAuth();
  const userPoints = user?.points || 0;
  const userLevel = getUserLevel(userPoints);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md  px-4 py-3 flex items-center justify-between">
      <span className="text-xl font-bold text-jungle"></span>

      <div className="flex items-center gap-3">
        {/* Points Badge */}
        <div className="flex items-center gap-2 bg-cream px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
          <Trophy size={14} className="text-coral" />
          <span className="font-bold text-xs text-foreground">{userPoints} pts</span>
        </div>

        {/* Profile Avatar */}
        <Link to="/profile" className="relative group">
          <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden bg-white shadow-sm transition-transform hover:scale-105">
            <img
              src={userLevel.avatar}
              alt={userLevel.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar />
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        "pb-32 md:pb-8" // Increased padding to prevent chat widget overlap with content on mobile
      )}>
        <Header />
        {children}
        <ChatWidget />
      </main>
      <BottomNav />
    </div>
  );
};
