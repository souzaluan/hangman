import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'node:crypto';
import { PlayerType } from './constants';
import { Player, Room } from './entities';
import { NotFoundError } from './errors';
import { SuccessNotification } from './notifications';

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

    const room = Room.create({ id: roomCode });
    rooms.push(room);

    const player = Player.create({
      id: socket.id,
      name: 'Player 1',
      type: PlayerType.Admin,
      roomCode,
    });
    players.push(player);

    socket.join(roomCode);
    callback(roomCode);
  });

  socket.on('join-room', (code, callback) => {
    console.log('> join room');

    const room = rooms.find((_room) => _room.id === code);

    if (!room) return callback(new NotFoundError());

    const playersInRoom = players.filter((player) => player.roomCode === code);

    const player = Player.create({
      id: socket.id,
      name: `Player ${playersInRoom.length + 1}`,
      type: PlayerType.Guest,
      roomCode: room.id,
    });
    players.push(player);

    socket.join(room.id);

    socket
      .in(room.id)
      .emit('notification', new SuccessNotification(`${player.name} joined!`));

    callback();
  });
});

http.listen(3333);
