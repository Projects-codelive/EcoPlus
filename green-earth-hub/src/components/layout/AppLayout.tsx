import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { useAuth } from '@/context/AuthContext';
import { Trophy } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
      <span className="text-xl font-bold text-jungle">EcoPlus</span>
      <div className="flex items-center gap-2 bg-cream px-3 py-1 rounded-full border border-primary/20">
        <Trophy size={16} className="text-coral" />
        <span className="font-bold text-sm text-foreground">{user?.points || 0} pts</span>
      </div>
    </header>
  );
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
