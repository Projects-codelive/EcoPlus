import { useRef, useEffect, useState } from 'react';
import { useChatStore } from '@/hooks/useChatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatWidget = () => {
    const {
        messages,
        isOpen,
        isLoading,
        unreadCount,
        toggleChat,
        closeChat,
        sendMessage
    } = useChatStore();

    const scrollRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="fixed bottom-[5.5rem] right-4 md:bottom-8 z-[60] flex flex-col items-end">
            {/* Chat Window */}
            <div
                className={cn(
                    "bg-card border border-border shadow-xl rounded-2xl w-[calc(100vw-2rem)] md:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none h-0"
                )}
                style={{ maxHeight: '600px', height: '60vh' }}
            >
                {/* Header */}
                <div className="bg-primary/10 p-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/20 rounded-full">
                            <Bot size={20} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Eco Assistant</h3>
                            <p className="text-xs text-muted-foreground">Ask me about sustainability!</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8">
                        <X size={16} />
                    </Button>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(60vh-130px)] bg-background/50"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full mb-4",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] p-3 rounded-2xl text-sm",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted text-muted-foreground rounded-tl-none border border-border"
                                )}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="bg-muted p-3 rounded-2xl rounded-tl-none border border-border flex items-center gap-1">
                                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-border bg-card">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim() || isLoading}
                            className="shrink-0 bg-primary hover:bg-primary/90"
                        >
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={toggleChat}
                size="lg"
                className={cn(
                    "rounded-full h-14 w-14 shadow-lg transition-transform duration-200 hover:scale-105",
                    isOpen ? "bg-muted text-muted-foreground hover:bg-muted/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <div className="relative">
                        <MessageCircle size={28} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-background">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                )}
            </Button>
        </div>
    );
};
