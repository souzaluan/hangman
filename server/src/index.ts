import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';

import crypto from 'node:crypto';

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
  socket.on('get-room', (code: string) => {
    const isOpponent = rooms[code]?.opponents.some(
      (opponent) => opponent === socket.id
    );

    if (isOpponent)
      return socket.emit('setup', { ...rooms[code], profile: 'guest' });

    const isOwner = rooms[code]?.owner === socket.id;

    if (isOwner)
      return socket.emit('setup', { ...rooms[code], profile: 'owner' });

    return socket.emit('unauthorized');
  });

  socket.on('create-room', () => {
    const code = crypto.randomUUID();

    rooms[code] = {
      owner: socket.id,
      status: RoomStatus.Waiting,
      opponents: [],
      code,
    };

    socket.emit('created-room', rooms[code]);
  });

  socket.on('join-room', (code: string) => {
    const room = rooms[code];

    if (!room) return socket.emit('not-found-room');

    const roomAlreadyStarted = room.status === RoomStatus.Playing;

    if (roomAlreadyStarted) return socket.emit('room-already-started');

    rooms[code] = {
      ...room,
      opponents: [...room.opponents, socket.id],
      status: RoomStatus.Playing,
    };

    socket.emit('joined-room', rooms[code]);
    socket.to(room.owner).emit('choose-word');
  });
});

http.listen(3333);
