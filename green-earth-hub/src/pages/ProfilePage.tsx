import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight, Flame, User as UserIcon, Trophy, Share2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import { API_BASE } from '@/lib/api';
import { getUserLevel } from '@/utils/levelUtils';
import { AvatarGallery } from '@/components/profile/AvatarGallery';
import { BadgeList } from '@/components/profile/BadgeList';
import { SettingsModal } from '@/components/profile/SettingsModal';
import { PrivacyModal } from '@/components/profile/PrivacyModal';
import { HelpSupportModal } from '@/components/profile/HelpSupportModal';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const [stats, setStats] = useState({ totalEmissions: 0, totalSaved: 0 });
  const [activityData, setActivityData] = useState({
    activityLog: [],
    streak: 0,
    lastActiveDate: null
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Fallback safe user for fetching visual data
  const safeUser = user || {
    fullName: 'Eco Warrior',
    points: 0,
    mobileNo: '',
    avatar: undefined,
    badges: []
  };

  const userLevel = getUserLevel(safeUser.points);
  const displayAvatar = safeUser.avatar || userLevel.avatar;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/journey/stats?_t=${Date.now()}`, {
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

    const getTodayLocal = () => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const fetchActivityData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/activity/data`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setActivityData(data);
          return data;
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
      return null;
    };

    const logActivity = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/activity/log`, {
          method: 'POST',
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setActivityData((prev) => ({
            ...prev,
            streak: data.streak ?? prev.streak
          }));
          await fetchActivityData();
        }
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    };

    const load = async () => {
      await fetchStats();
      const data = await fetchActivityData();
      const today = getTodayLocal();
      const alreadyLoggedToday =
        data?.lastActiveDate === today ||
        data?.activityLog?.some((e: { date: string }) => e.date === today);
      if (data && !alreadyLoggedToday) {
        await logActivity();
      }
    };
    load();
  }, []);

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="lisboa-card text-center relative overflow-hidden">
          {/* Level Progress Background Hint */}
          <div
            className="absolute top-0 left-0 h-1 bg-accent/50"
            style={{ width: `${(safeUser.points / userLevel.maxPoints) * 100}%` }}
          />

          <div
            className="w-32 h-32 rounded-full border-4 border-accent/20 p-1 mx-auto mb-4 bg-white shadow-sm relative group cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIsGalleryOpen(true)}
          >
            <img
              src={displayAvatar}
              alt={userLevel.name}
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
            </div>
            <div className="absolute bottom-1 right-1 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border-2 border-white">
              Lvl {userLevel.level}
            </div>
          </div>

          <h1 className="text-xl font-bold text-foreground">{safeUser.fullName}</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <span>{safeUser.mobileNo}</span>
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-foreground">{safeUser.points || 0}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Points</p>
            </div>
            <div className="text-center border-l border-r border-border/50 px-1">
              <p className="text-xl md:text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                <Flame className="text-orange-500" size={20} />
                {activityData.streak}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalSaved} kg</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">CO₂ Saved</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (user?.id) {
                const link = `${window.location.origin}/share/${user.id}`;
                navigator.clipboard.writeText(link);
                toast.success('Profile link copied!', {
                  description: 'Share it with your friends to show off your stats.'
                });
              }
            }}
            className="mt-6 w-full py-2 bg-primary/5 text-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <Share2 size={18} />
            Share Profile
          </button>
        </div>

        <AvatarGallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          userPoints={safeUser.points}
          currentAvatar={safeUser.avatar}
          onAvatarUpdate={(newAvatar) => {
            refreshUser(); // Refresh global user state to update UI immediately
            // Ideally refreshUser fetches from backend where update just happened
          }}
        />
        <div className="lisboa-card p-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              Badges
            </h2>
          </div>
          <BadgeList earnedBadges={safeUser.badges || []} />
        </div>

        {/* Activity Heatmap */}

        {/* Activity Heatmap */}
        <ActivityHeatmap activityLog={activityData.activityLog} />

        {/* Settings Links */}
        <div className="lisboa-card p-0 overflow-hidden">
          {[
            { icon: UserIcon, label: 'Avatars', action: 'View Gallery', onClick: () => setIsGalleryOpen(true) },
            { icon: Bell, label: 'Notifications', action: 'Enabled' },
            { icon: Shield, label: 'Privacy', action: '', onClick: () => setIsPrivacyOpen(true) },
            { icon: HelpCircle, label: 'Help & Support', action: '', onClick: () => setIsHelpOpen(true) },
            { icon: Settings, label: 'Settings', action: '', onClick: () => setIsSettingsOpen(true) },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
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

        {/* Modals */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        <HelpSupportModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

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