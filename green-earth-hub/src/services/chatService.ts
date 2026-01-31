import { Message } from '@/types/chat';

const CLIMATE_SYSTEM_PROMPT = `You are EcoBot, a friendly and knowledgeable climate change awareness assistant for Green Earth Hub. Your mission is to:

1. Educate users about climate change, its causes, and impacts
2. Provide personalized tips to reduce carbon footprints
3. Offer actionable, practical steps for sustainable living
4. Share encouraging facts about environmental progress
5. Answer questions about renewable energy, conservation, and eco-friendly practices

Guidelines:
- Keep responses concise and actionable (2-3 paragraphs max)
- Use an encouraging, positive tone
- Provide specific, measurable actions when possible
- If asked off-topic questions, politely redirect to climate/sustainability topics
- Use emojis sparingly to make responses friendly
- Focus on solutions and empowerment, not doom and gloom`;

class ChatService {
    private rateLimitCount = 0;
    private rateLimitReset = Date.now();
    private apiKey: string;

    constructor() {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        if (!this.apiKey) {
            console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
        }
    }

    async sendMessage(message: string, conversationHistory: Message[]): Promise<string> {
        // Rate limiting: 10 messages per minute
        if (this.rateLimitCount >= 10) {
            if (Date.now() - this.rateLimitReset < 60000) {
                throw new Error('Rate limit exceeded. Please wait a moment before sending more messages.');
            } else {
                this.rateLimitCount = 0;
                this.rateLimitReset = Date.now();
            }
        }

        this.rateLimitCount++;

        // Use Gemini API if key is available
        if (this.apiKey) {
            try {
                return await this.sendMessageToGemini(message, conversationHistory);
            } catch (error) {
                console.error('Gemini API error:', error);
                throw new Error('Failed to get response from AI. Please try again.');
            }
        } else {
            throw new Error('API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
        }
    }

    private async sendMessageToGemini(message: string, conversationHistory: Message[]): Promise<string> {
        // Build conversation history for Gemini
        const contents = [];

        // Add system prompt as first user message
        if (conversationHistory.length === 0) {
            contents.push({
                role: 'user',
                parts: [{ text: CLIMATE_SYSTEM_PROMPT }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: 'Understood! I\'m EcoBot, ready to help with climate action and sustainability. How can I assist you today?' }]
            });
        }

        // Add conversation history
        conversationHistory.forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        });

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from AI');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        return aiResponse;
    }
}

export const chatService = new ChatService();