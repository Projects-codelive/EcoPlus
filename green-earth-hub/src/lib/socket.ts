import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL === undefined
    ? 'http://localhost:5001'
    : import.meta.env.VITE_API_URL;

export const socket = io(API_URL, {
    autoConnect: false // We connect manually in components
});
