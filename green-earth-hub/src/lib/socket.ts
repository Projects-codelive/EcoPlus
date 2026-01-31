import { io } from 'socket.io-client';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5001';

export const socket = io(API_URL, {
    autoConnect: false // We connect manually in components
});
