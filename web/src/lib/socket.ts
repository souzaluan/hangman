import io from 'socket.io-client';
import { PUBLIC_SOCKET_API_URL }  from '$env/static/public'

export const socket = io(PUBLIC_SOCKET_API_URL, { transports: ['websocket'] });
