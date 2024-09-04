import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'node:crypto';
import { ErrorType, NotificationType, PlayerType } from './constants';
import type { Player, Room } from './domain';
import { ErrorFactory, NotificationFactory } from './factories';

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
  console.log('> new connection: ', socket.id);

  socket.on('create-room', (callback) => {
    console.log('> create room');

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
    console.log('> join room');

    const room = rooms.find((_room) => _room.code === code);

    if (!room) return callback(new ErrorFactory(ErrorType.NotFound));

    const player: Player = {
      id: socket.id,
      name: `Player ${room.players.length + 1}`,
      type: PlayerType.Guest,
      roomCode: room.code,
    };

    players.push(player);
    room.players.push(player);

    socket.join(room.code);

    socket
      .in(room.code)
      .emit(
        'notification',
        new NotificationFactory(
          NotificationType.Success,
          `${player.name} joined!`
        )
      );

    callback();
  });
});

http.listen(3333);
