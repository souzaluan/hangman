import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'node:crypto';
import { PlayerType } from './constants';
import { Player, Room } from './domain';

const app = express();

const http = createServer(app);

const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const players: Player[] = [];
const rooms: Room[] = [];

io.on('connection', (socket) => {
  socket.on('create-room', (callback) => {
    const roomCode = crypto.randomUUID();

    const player: Player = {
      id: socket.id,
      name: 'Player 1',
      type: PlayerType.Admin,
      roomCode,
    };

    players.push(player);
    rooms.push({ code: roomCode, players: [player] });

    socket.join(roomCode);
    callback(roomCode);
  });

  socket.on('join-room', (code, callback) => {
    const room = rooms.find((_room) => _room.code === code);

    if (!room) return callback({ type: 'not-found' });

    const player: Player = {
      id: socket.id,
      name: `Player ${room.players.length + 1}`,
      type: PlayerType.Guest,
      roomCode: code,
    };

    players.push(player);
    room.players.push(player);

    callback();
  });
});

http.listen(3333);
