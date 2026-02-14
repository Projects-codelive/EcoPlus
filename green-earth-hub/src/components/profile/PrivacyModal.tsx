import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield, Eye, Lock, Database, UserX } from 'lucide-react';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
    const privacySections = [
        {
            icon: Database,
            title: 'Data Collection',
            description: 'We collect your activity data, carbon footprint metrics, and profile information to provide personalized insights and track your environmental impact.',
        },
        {
            icon: Lock,
            title: 'Data Security',
            description: 'Your data is encrypted and stored securely. We use industry-standard security measures to protect your personal information.',
        },
        {
            icon: Eye,
            title: 'Data Visibility',
            description: 'You control what information is shared publicly. Your profile visibility settings determine what others can see.',
        },
        {
            icon: UserX,
            title: 'Your Rights',
            description: 'You have the right to access, modify, or delete your data at any time. Contact support for data-related requests.',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg rounded-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Shield className="text-accent" size={28} />
                        Privacy Policy
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        How we protect and use your data
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {privacySections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div key={section.title} className="flex gap-4 p-4 rounded-2xl bg-card border border-border">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Icon className="text-accent" size={24} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">{section.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border">
                        <p className="text-sm text-muted-foreground text-center">
                            Last updated: February 2026
                        </p>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            For detailed privacy information, contact{' '}
                            <a href="mailto:privacy@ecoplus.com" className="text-accent hover:underline">
                                privacy@ecoplus.com
                            </a>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
