import { useChatStore } from '@/hooks/useChatStore';
import { ChatWindow } from './ChatWindow';
import { FloatingChatButton } from './FloatingChatButton';

export const ChatBot = () => {
    const { messages, isOpen, isLoading, unreadCount, toggleChat, closeChat, sendMessage } = useChatStore();

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <FloatingChatButton onClick={toggleChat} unreadCount={unreadCount} />
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 md:bottom-6 right-6 w-[calc(100vw-3rem)] md:w-96 h-[32rem] z-50 animate-in slide-in-from-bottom-4 duration-300">
                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        onClose={closeChat}
                        onSendMessage={sendMessage}
                    />
                </div>
            )}
        </>
    );
};
