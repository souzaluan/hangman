import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';

import { Room } from './domain/Room';
import { RoomStatus } from './constants/RoomStatus';

const app = express();

const http = createServer(app);

const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const rooms: Record<string, Room> = {};

io.on('connection', (socket) => {
  socket.on('create-room', (code: string) => {
    rooms[code] = {
      owner: socket.id,
      status: RoomStatus.Waiting,
      opponents: [],
    };
  });

  // eslint-disable-next-line consistent-return
  socket.on('join-room', (code: string) => {
    const room = rooms[code];

    if (!room) return socket.emit('not-found-room');

    const roomAlreadyStarted = room.status !== RoomStatus.Waiting;

    if (roomAlreadyStarted) return socket.emit('room-already-started');

    rooms[code] = { ...room, opponents: [...room.opponents, socket.id] };
  });
});

http.listen(3333);
