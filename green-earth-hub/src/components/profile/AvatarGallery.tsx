import { Lock, Check, Loader2 } from 'lucide-react';
import { LEVEL_THRESHOLDS, getUserLevel } from '@/utils/levelUtils';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { API_BASE } from '@/lib/api';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AvatarGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    userPoints: number;
    currentAvatar?: string;
    onAvatarUpdate?: (newAvatar: string) => void;
}

export const AvatarGallery = ({ isOpen, onClose, userPoints, currentAvatar, onAvatarUpdate }: AvatarGalleryProps) => {
    const currentUserLevel = getUserLevel(userPoints);
    const { user, refreshUser } = useAuth(); // Assuming refreshUser exists, or we just update local state if safe
    const [updating, setUpdating] = useState<string | null>(null);

    const handleSelectAvatar = async (avatarUrl: string, isUnlocked: boolean) => {
        if (!isUnlocked || updating) return;

        setUpdating(avatarUrl);
        try {
            const response = await fetch(`${API_BASE}/api/users/update-avatar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ avatar: avatarUrl }),
                credentials: 'include'
            });

            if (response.ok) {
                if (onAvatarUpdate) onAvatarUpdate(avatarUrl);
                // Trigger a user refresh if possible, or parent will handle it
                // Close dialog after short delay for feedback
                setTimeout(() => {
                    onClose();
                    setUpdating(null);
                }, 500);
            }
        } catch (error) {
            console.error("Failed to update avatar", error);
            setUpdating(null);
        }
    };

    // Determine active avatar: use prop, or fallback to user's saved, or fallback to level default
    const activeAvatar = currentAvatar || user?.avatar || currentUserLevel.avatar;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">Choose Your Avatar</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
                    {LEVEL_THRESHOLDS.map((level) => {
                        const isUnlocked = level.level <= currentUserLevel.level;
                        const isSelected = level.avatar === activeAvatar;
                        const isProcessing = updating === level.avatar;

                        return (
                            <div
                                key={level.level}
                                onClick={() => handleSelectAvatar(level.avatar, isUnlocked)}
                                className={cn(
                                    "relative group rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer",
                                    isSelected ? "border-accent ring-4 ring-accent/20 scale-105" :
                                        isUnlocked ? "border-emerald-500/30 hover:border-emerald-500 hover:shadow-md" :
                                            "border-muted bg-muted/50 opacity-70 cursor-not-allowed"
                                )}
                            >
                                {/* Avatar Image */}
                                <div className="aspect-square relative">
                                    <img
                                        src={level.avatar}
                                        alt={level.name}
                                        className={cn(
                                            "w-full h-full object-cover transition-transform duration-500",
                                            !isUnlocked && "grayscale blur-[2px]",
                                            isUnlocked && "group-hover:scale-110"
                                        )}
                                    />

                                    {/* Status Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        {!isUnlocked && (
                                            <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
                                                <Lock className="w-8 h-8 text-white/80" />
                                            </div>
                                        )}
                                        {isProcessing && (
                                            <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                        {isSelected && !isProcessing && (
                                            <div className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                                <Check size={10} /> SELECTED
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Level Info Footer */}
                                <div className={cn(
                                    "p-3 text-center transition-colors",
                                    isSelected ? "bg-accent text-white" :
                                        isUnlocked ? "bg-card group-hover:bg-accent/5" : "bg-muted"
                                )}>
                                    <p className={cn(
                                        "font-bold text-sm",
                                        isSelected ? "text-white" : "text-foreground"
                                    )}>
                                        {level.name}
                                    </p>
                                    <p className={cn(
                                        "text-xs",
                                        isSelected ? "text-white/90" : "text-muted-foreground"
                                    )}>
                                        Level {level.level}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};
