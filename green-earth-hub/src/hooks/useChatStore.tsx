import { useState, useCallback } from 'react';
import { Message, ChatState } from '@/types/chat';
import { chatService } from '@/services/chatService';

// Simple global state/hook pattern (or context) needed if we want persistence across pages without a library like Zustand
// For now, attaching to a Context or just using this hook in a top-level component that passes props is best.
// To make it "visible to every page", we should use it in the Layout and render the widget there.
// If we want the specific state to persist exactly as is, we might want a Context. 
// BUT, the prompt gave us "useChatStore" which implies a store. 
// Since I don't see Zustand/Redux, I will make this a Context Provider or keep it local to the layout.
// Let's stick to the hook logic provided but ensure it's used in a top-level location.

export const useChatStore = () => {
    const [state, setState] = useState<ChatState>({
        messages: [{
            id: 'init-1',
            role: 'assistant',
            content: 'Hi! I am your Eco-Assistant. Ask me anything about reducing your carbon footprint!',
            timestamp: new Date()
        }],
        isOpen: false,
        isLoading: false,
        unreadCount: 1
    });

    const toggleChat = useCallback(() => {
        setState(prev => ({
            ...prev,
            isOpen: !prev.isOpen,
            unreadCount: !prev.isOpen ? 0 : prev.unreadCount
        }));
    }, []);

    const openChat = useCallback(() => {
        setState(prev => ({
            ...prev,
            isOpen: true,
            unreadCount: 0
        }));
    }, []);

    const closeChat = useCallback(() => {
        setState(prev => ({
            ...prev,
            isOpen: false
        }));
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date()
        };

        // Add user message immediately
        setState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isLoading: true
        }));

        try {
            // Get AI response
            const response = await chatService.sendMessage(content, state.messages);

            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setState(prev => ({
                ...prev,
                messages: [...prev.messages, aiMessage],
                isLoading: false,
                unreadCount: prev.isOpen ? 0 : prev.unreadCount + 1
            }));
        } catch (error) {
            console.error('Error sending message:', error);

            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: '⚠️ Sorry, I encountered an error. Please try again in a moment.',
                timestamp: new Date()
            };

            setState(prev => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
                isLoading: false
            }));
        }
    }, [state.messages]);

    return {
        ...state,
        toggleChat,
        openChat,
        closeChat,
        sendMessage
    };
};