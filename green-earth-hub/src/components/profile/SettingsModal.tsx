import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { theme, setTheme } = useTheme();

    const themeOptions = [
        { value: 'light' as const, label: 'Light', icon: Sun, description: 'Light theme' },
        { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Dark theme' },
        { value: 'system' as const, label: 'System', icon: Monitor, description: 'Follow system' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">Settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Customize your app experience
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Theme Section */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">Appearance</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {themeOptions.map((option) => {
                                const Icon = option.icon;
                                const isSelected = theme === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className={`
                      flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                      ${isSelected
                                                ? 'border-accent bg-accent/10 shadow-md'
                                                : 'border-border bg-card hover:border-accent/50 hover:bg-accent/5'
                                            }
                    `}
                                    >
                                        <Icon
                                            size={24}
                                            className={isSelected ? 'text-accent' : 'text-muted-foreground'}
                                        />
                                        <span className={`text-sm font-medium ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Additional Settings Placeholder */}
                    <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground text-center">
                            More settings coming soon...
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
