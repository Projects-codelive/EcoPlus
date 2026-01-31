import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
    onClick: () => void;
    unreadCount: number;
}

export const FloatingChatButton = ({ onClick, unreadCount }: FloatingChatButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="floating-chat-btn fixed bottom-[calc(5rem+1.5rem)] md:bottom-6 right-6 w-14 h-14 rounded-full bg-coral hover:bg-coral/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 z-40 flex items-center justify-center group"
            aria-label="Open chat"
        >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />

            {/* Unread Badge */}
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}

            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-coral animate-ping opacity-20"></span>
        </button>
    );
};
