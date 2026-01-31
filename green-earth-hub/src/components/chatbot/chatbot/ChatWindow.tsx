import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatWindowProps {
    messages: any[];
    isLoading: boolean;
    onClose: () => void;
    onSendMessage: (message: string) => void;
}

export const ChatWindow = ({ messages, isLoading, onClose, onSendMessage }: ChatWindowProps) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleQuickAction = (prompt: string) => {
        if (!isLoading) {
            onSendMessage(prompt);
        }
    };

    return (
        <div className="chat-window flex flex-col h-full bg-background border border-border rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-jungle to-jungle/90">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center">
                        <span className="text-xl">🌍</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">EcoBot</h3>
                        <p className="text-xs text-white/80">Climate Action Assistant</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Close chat"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lime to-success mx-auto mb-4 flex items-center justify-center">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <h4 className="font-semibold text-lg mb-2">Welcome to EcoBot!</h4>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                I'm here to help you take climate action. Ask me anything about reducing your carbon footprint!
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))
                    )}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex gap-3 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jungle text-white flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                            <div className="bg-card border border-border rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length === 0 && <QuickActions onActionClick={handleQuickAction} />}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-muted/20">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about climate action..."
                        className="flex-1 px-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="w-12 h-12 rounded-full bg-coral hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        aria-label="Send message"
                    >
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </div>
            </form>
        </div>
    );
};
