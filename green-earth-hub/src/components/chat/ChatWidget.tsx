import { useRef, useEffect, useState } from 'react';
import { useChatStore } from '@/hooks/useChatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, MessageCircle, Leaf, Lightbulb, Car, Zap, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ChatWidget = () => {
    const {
        messages,
        isOpen,
        isLoading,
        unreadCount,
        toggleChat,
        closeChat,
        clearChat,
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

    const handleQuickAction = (text: string) => {
        sendMessage(text);
    };

    const quickActions = [
        { icon: Leaf, label: 'Carbon Footprint', text: 'How can I reduce my carbon footprint?' },
        { icon: Lightbulb, label: 'Daily Tips', text: 'Give me a daily eco-tip.' },
        { icon: Car, label: 'Transportation', text: 'What are eco-friendly transportation options?' },
        { icon: Zap, label: 'Energy Saving', text: 'How can I save energy at home?' },
    ];

    return (
        <div className="fixed bottom-[5.5rem] right-4 md:bottom-8 z-[60] flex flex-col items-end font-sans pointer-events-none">
            {/* Chat Window */}
            <div
                className={cn(
                    "bg-[#f0fdf4] border border-emerald-100 shadow-2xl rounded-2xl w-[calc(100vw-2rem)] md:w-[350px] mb-4 overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col pointer-events-auto",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none h-0"
                )}
                style={{ maxHeight: '500px', height: '500px' }}
            >
                {/* Header */}
                <div className="bg-[#1b3b36] p-3.5 flex justify-between items-center text-white shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="p-1.5 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                                <Bot size={20} className="text-emerald-100" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#1b3b36] rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm leading-tight">EcoBot</h3>
                            <p className="text-[10px] text-emerald-200/80 font-medium">Climate Action Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearChat}
                            className="h-7 w-7 text-emerald-200/70 hover:bg-emerald-800/50 hover:text-white transition-colors"
                            title="Clear Chat"
                        >
                            <Trash2 size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeChat}
                            className="h-7 w-7 text-emerald-200/70 hover:bg-emerald-800/50 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 scroll-smooth"
                >
                    {messages.length === 0 ? (
                        // Welcome Screen
                        <div className="flex flex-col items-center justify-center h-full space-y-6 pt-4">
                            <div className="relative">
                                <div className="w-16 h-8 bg-[#84cc16] rounded-b-full absolute -top-8 left-1/2 -translate-x-1/2 rotate-180 opacity-20"></div> {/* Abstract decorative element */}
                                <div className="w-16 h-16 bg-[#84cc16] rounded-full flex items-center justify-center shadow-sm relative z-10">
                                    <Leaf className="text-white fill-white" size={32} />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-bold text-[#1e453e]">Welcome to EcoBot!</h2>
                                <p className="text-sm text-gray-600 max-w-[240px] leading-relaxed">
                                    I'm here to help you take climate action. Ask me anything about reducing your carbon footprint!
                                </p>
                            </div>

                            <div className="w-full space-y-3 pt-2">
                                <p className="text-xs font-semibold text-[#1e453e] uppercase tracking-wider pl-1">Quick Actions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action.text)}
                                            className="bg-white border border-emerald-100 p-3 rounded-xl flex items-center gap-2 hover:border-[#84cc16] hover:shadow-sm transition-all text-left group"
                                        >
                                            <action.icon size={16} className="text-[#1e453e] group-hover:text-[#84cc16] transition-colors" />
                                            <span className="text-xs font-medium text-gray-700">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Messages
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] p-3.5 shadow-sm text-sm",
                                            msg.role === 'user'
                                                ? "bg-[#1e453e] text-white rounded-2xl rounded-tr-sm"
                                                : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-emerald-50"
                                        )}
                                    >
                                        {msg.role === 'user' ? (
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        ) : (
                                            <div className="prose prose-sm prose-p:leading-relaxed prose-headings:text-[#1e453e] prose-strong:text-[#1e453e] max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h3: ({ node, ...props }) => <h3 className="font-bold text-sm mb-1 mt-2" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                        li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start w-full">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-emerald-50 shadow-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-[#84cc16] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-[#84cc16] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-[#84cc16] rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#f0fdf4]">
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about climate action..."
                                className="w-full rounded-full border-emerald-200 focus-visible:ring-[#84cc16] bg-white h-11 pl-4 pr-4 text-sm shadow-sm"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim() || isLoading}
                            className="shrink-0 rounded-full h-11 w-11 bg-[#fdbd74] hover:bg-[#b08044] text-white shadow-md transition-all disabled:opacity-50"
                        >
                            <Send size={18} className="ml-0.5" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={toggleChat}
                size="lg"
                className={cn(
                    "rounded-full h-14 w-14 shadow-lg transition-transform duration-200 hover:scale-105 z-[60] pointer-events-auto",
                    isOpen ? "bg-white text-gray-600 hover:bg-gray-50 border border-emerald-100" : "bg-[#1e453e] text-white hover:bg-[#16332e]"
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
