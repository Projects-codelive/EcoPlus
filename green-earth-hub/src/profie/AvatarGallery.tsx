import { Lock, Check } from 'lucide-react';
import { LEVEL_THRESHOLDS, getUserLevel } from '@/utils/levelUtils';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AvatarGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    userPoints: number;
}

export const AvatarGallery = ({ isOpen, onClose, userPoints }: AvatarGalleryProps) => {
    const currentUserLevel = getUserLevel(userPoints);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">Level Avatars</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
                    {LEVEL_THRESHOLDS.map((level) => {
                        const isUnlocked = level.level <= currentUserLevel.level;
                        const isCurrent = level.level === currentUserLevel.level;

                        return (
                            <div
                                key={level.level}
                                className={cn(
                                    "relative group rounded-xl overflow-hidden border-2 transition-all duration-300",
                                    isCurrent ? "border-accent ring-4 ring-accent/20 scale-105" :
                                        isUnlocked ? "border-success/50 hover:border-success" :
                                            "border-muted bg-muted/50 opacity-70"
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
                                        {isCurrent && (
                                            <div className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                CURRENT
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Level Info Footer */}
                                <div className={cn(
                                    "p-3 text-center",
                                    isCurrent ? "bg-accent text-white" :
                                        isUnlocked ? "bg-card" : "bg-muted"
                                )}>
                                    <p className={cn(
                                        "font-bold text-sm",
                                        isCurrent ? "text-white" : "text-foreground"
                                    )}>
                                        {level.name}
                                    </p>
                                    <p className={cn(
                                        "text-xs",
                                        isCurrent ? "text-white/90" : "text-muted-foreground"
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