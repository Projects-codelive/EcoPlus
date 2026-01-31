import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from '@/lib/api';
import { Loader2, Flame, Trophy, MapPin, Calendar, Share2 } from 'lucide-react';
import { BadgeList } from '@/components/profile/BadgeList';
import { getUserLevel } from '@/utils/levelUtils';
import { toast } from 'sonner';

interface PublicProfileData {
    id: string;
    fullName: string;
    avatar: string; // or undefined
    points: number;
    badges: string[];
    joinedAt: string;
    stats: {
        streak: number;
        totalSaved: number;
        totalEmissions: number;
    };
}

const SharedProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState<PublicProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/users/public/${userId}`);
                if (!res.ok) throw new Error('Profile not found');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                setError('User not found or connection failed.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchProfile();
    }, [userId]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">Oops!</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link to="/" className="btn-coral">Go Home</Link>
            </div>
        );
    }

    const userLevel = getUserLevel(profile.points);
    const displayAvatar = profile.avatar || userLevel.avatar;

    return (
        <div className="min-h-screen bg-mint/30 pb-20">
            {/* Header / Nav Placeholder */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-border p-4 flex justify-between items-center">
                <span className="font-bold text-xl text-jungle">EcoPlus</span>
                <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
                    Login / Join
                </Link>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6 mt-4">

                {/* Profile Card */}
                <div className="lisboa-card text-center relative overflow-hidden bg-white shadow-xl animate-slide-up">
                    <div
                        className="absolute top-0 left-0 h-1.5 bg-accent/50"
                        style={{ width: `${(profile.points / userLevel.maxPoints) * 100}%` }}
                    />

                    <div className="relative inline-block mb-4 mt-2">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto bg-gray-100">
                            <img src={displayAvatar} alt={profile.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                            Lvl {userLevel.level}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-1">{profile.fullName}</h1>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mb-6">
                        <Calendar size={14} /> Joined {new Date(profile.joinedAt).toLocaleDateString()}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 border-t border-border/50 pt-6">
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{profile.points}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Points</p>
                        </div>
                        <div className="text-center border-l border-r border-border/50">
                            <div className="flex items-center justify-center gap-1 text-xl font-bold text-foreground">
                                <Flame className="text-orange-500 fill-orange-500" size={18} />
                                {profile.stats.streak}
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Streak</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{profile.stats.totalSaved}kg</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">CO₂ Saved</p>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="lisboa-card p-0 overflow-hidden bg-white shadow-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="p-4 border-b border-border bg-gray-50/50 flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2 text-foreground">
                            <Trophy className="text-yellow-500" size={18} />
                            Achievements
                        </h2>
                        <span className="text-xs font-medium text-muted-foreground">{profile.badges.length} Unlocked</span>
                    </div>
                    <BadgeList earnedBadges={profile.badges} />
                </div>

                {/* CTA */}
                <div className="text-center space-y-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <p className="text-sm text-muted-foreground">
                        Inspired by {profile.fullName.split(' ')[0]}? Start your own eco-journey!
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={handleShare} className="btn-coral flex items-center gap-2 px-6">
                            <Share2 size={18} /> Share
                        </button>
                        <Link to="/login" className="btn-jungle px-8">
                            Join Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharedProfilePage;
