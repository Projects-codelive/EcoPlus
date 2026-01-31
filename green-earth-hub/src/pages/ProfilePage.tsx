import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalEmissions: 0, totalSaved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/journey/stats', {
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

    fetchStats();
  }, []);

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="lisboa-card text-center">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-4xl mx-auto mb-4">
            ⚡
          </div>
          <h1 className="text-xl font-bold text-foreground">{user?.fullName || 'Eco Warrior'}</h1>
          <p className="text-muted-foreground">{user?.mobileNo}</p>

          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{user?.points || 0}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalSaved} kg</p>
              <p className="text-xs text-muted-foreground">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>

        {/* Settings Links */}
        <div className="lisboa-card p-0 overflow-hidden">
          {[
            { icon: Bell, label: 'Notifications', action: 'Enabled' },
            { icon: Shield, label: 'Privacy', action: '' },
            { icon: HelpCircle, label: 'Help & Support', action: '' },
            { icon: Settings, label: 'Settings', action: '' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-cream transition-colors text-left border-b border-border last:border-b-0"
              >
                <Icon size={20} strokeWidth={2.5} className="text-muted-foreground" />
                <span className="flex-1 font-medium text-foreground">{item.label}</span>
                {item.action && (
                  <span className="text-sm text-muted-foreground">{item.action}</span>
                )}
                <ChevronRight size={18} className="text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full lisboa-card-soft flex items-center justify-center gap-2 text-destructive font-semibold"
        >
          <LogOut size={18} strokeWidth={2.5} />
          Sign Out
        </button>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
