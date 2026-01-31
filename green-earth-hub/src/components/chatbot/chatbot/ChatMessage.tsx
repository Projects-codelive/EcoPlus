import { Message } from '@/types/chat';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
    const isUser = message.role === 'user';

    return (
        <div
            className={`flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-300 ${isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                        ? 'bg-coral text-white'
                        : 'bg-jungle text-white'
                    }`}
            >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`rounded-2xl px-4 py-3 ${isUser
                            ? 'chat-bubble-user bg-coral text-white'
                            : 'chat-bubble-ai bg-card border border-border'
                        }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>

                {/* Timestamp */}
                <span className="text-xs text-muted-foreground mt-1 px-2">
                    {format(message.timestamp, 'h:mm a')}
                </span>
            </div>
        </div>
    );
};
