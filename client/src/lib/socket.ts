import io from 'socket.io-client';

export const socket = io('https://hangman-1f1e.onrender.com', { transports: ['websocket'] });
