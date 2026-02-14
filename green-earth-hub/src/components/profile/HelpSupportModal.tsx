import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { HelpCircle, Mail, MessageCircle, BookOpen, ExternalLink } from 'lucide-react';

interface HelpSupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpSupportModal = ({ isOpen, onClose }: HelpSupportModalProps) => {
    const faqs = [
        {
            question: 'How do I earn points?',
            answer: 'Complete daily quizzes, track your carbon footprint, participate in challenges, and engage with the community to earn points.',
        },
        {
            question: 'What are badges?',
            answer: 'Badges are achievements you unlock by reaching milestones, maintaining streaks, and completing special challenges.',
        },
        {
            question: 'How is my carbon footprint calculated?',
            answer: 'We calculate your footprint based on your transportation choices, distance traveled, and activity patterns using standard emission factors.',
        },
    ];

    const supportOptions = [
        {
            icon: Mail,
            title: 'Email Support',
            description: 'support@ecoplus.com',
            action: 'mailto:support@ecoplus.com',
        },
        {
            icon: MessageCircle,
            title: 'Community Forum',
            description: 'Ask questions and connect',
            action: '#',
        },
        {
            icon: BookOpen,
            title: 'Documentation',
            description: 'Guides and tutorials',
            action: '#',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg rounded-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <HelpCircle className="text-accent" size={28} />
                        Help & Support
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Find answers and get assistance
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* FAQ Section */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="p-4 rounded-2xl bg-card border border-border">
                                    <h4 className="font-semibold text-foreground mb-2 flex items-start gap-2">
                                        <span className="text-accent">Q:</span>
                                        {faq.question}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Options */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">Contact Support</h3>
                        <div className="space-y-3">
                            {supportOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <a
                                        key={option.title}
                                        href={option.action}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                            <Icon className="text-accent" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-foreground">{option.title}</h4>
                                            <p className="text-sm text-muted-foreground">{option.description}</p>
                                        </div>
                                        <ExternalLink className="text-muted-foreground group-hover:text-accent transition-colors" size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                        <p className="text-sm text-muted-foreground text-center">
                            Need immediate assistance? We typically respond within 24 hours.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
