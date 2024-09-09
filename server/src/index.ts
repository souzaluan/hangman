import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'node:crypto';
import { PlayerType } from './constants';
import { Player, Room } from './entities';
import { SuccessNotification } from './notifications';
import { ProfileResponse, SetupResponse } from './responses';

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

  socket.on('create-room', () => {
    console.log('> create room');

    const roomCode = crypto.randomUUID();

    const room = Room.create({ id: roomCode, maxAttempts: 5 });
    rooms.push(room);

    const player = Player.create({
      id: socket.id,
      name: 'Player 1',
      type: PlayerType.Admin,
      roomCode,
    });
    players.push(player);

    socket.join(roomCode);

    const setup: SetupResponse = {
      room: {
        id: room.id,
        maxAttempts: room.maxAttempts,
        remainingAttempts: room.remainingAttempts ?? room.maxAttempts,
        wrongGuesses: room.wrongGuesses,
        correctGuesses: room.correctGuesses,
        letters: room.letters,
        wordLength: room.word.length,
        playerChoosesWord: null,
      },
    };
    const profile: ProfileResponse = {
      id: player.id,
      name: player.name,
      type: player.type,
    };

    socket.emit('setup', setup);
    socket.emit('profile', profile);
  });

  socket.on('join-room', (code, callback) => {
    console.log('> join room');

    const room = rooms.find((_room) => _room.id === code);

    const playersInRoom = players.filter(
      (_player) => _player.roomCode === code
    );

    const amountPlayersInRoom = playersInRoom.length;

    const isValidRoom = room && amountPlayersInRoom > 0;

    if (!isValidRoom) {
      return callback('Sala não encontrada.');
    }

    if (amountPlayersInRoom > 1) {
      return callback('A sala está cheia.');
    }

    const player = Player.create({
      id: socket.id,
      name: `Player ${amountPlayersInRoom + 1}`,
      type: PlayerType.Guest,
      roomCode: room.id,
    });
    players.push(player);

    socket.join(room.id);

    const playerChoosesWord = playersInRoom[0];
    room.playerChoosesWord = playerChoosesWord;
    socket.to(playerChoosesWord.id).emit('choose-word');

    socket
      .in(room.id)
      .emit('notification', new SuccessNotification(`${player.name} joined!`));

    const setup: SetupResponse = {
      room: {
        id: room.id,
        maxAttempts: room.maxAttempts,
        remainingAttempts: room.remainingAttempts ?? room.maxAttempts,
        wrongGuesses: room.wrongGuesses,
        correctGuesses: room.correctGuesses,
        letters: room.letters,
        wordLength: room.word.length,
        playerChoosesWord: room.playerChoosesWord.id,
      },
    };
    const profile: ProfileResponse = {
      id: player.id,
      name: player.name,
      type: player.type,
    };

    io.in(room.id).emit('setup', setup);
    socket.emit('profile', profile);

    callback();
  });

  socket.on(
    'set-word',
    ({ roomCode, word }: { roomCode: string; word: string }, callback) => {
      console.log('> set word');

      const player = players.find((_player) => _player.id === socket.id);

      const room = rooms.find((_room) => _room.id === roomCode);

      if (!room || !player) return callback('Ops, ocorreu um erro.');

      room.word = word;
      room.letters = Array.from({ length: room.word.length }, () => '_');

      const setup: SetupResponse = {
        room: {
          id: room.id,
          maxAttempts: room.maxAttempts,
          remainingAttempts: room.remainingAttempts ?? room.maxAttempts,
          wrongGuesses: room.wrongGuesses,
          correctGuesses: room.correctGuesses,
          letters: room.letters,
          wordLength: room.word.length,
          playerChoosesWord: room.playerChoosesWord?.id ?? null,
        },
      };

      io.in(room.id).emit('setup', setup);

      callback();
    }
  );

  socket.on('take-guess', (letter: string, callback) => {
    console.log('> take guess');

    const player = players.find((_player) => _player.id === socket.id);

    const room = rooms.find((_room) => _room.id === player?.roomCode);

    if (!room || !player) return callback('Ops, ocorreu um erro.');

    const normalizedLetter = letter.trim().toUpperCase();
    const isCorrectGuess = room.word.includes(normalizedLetter);

    if (isCorrectGuess) {
      room.addCorrectGuess(normalizedLetter);
    } else {
      room.decrementRemainingAttempts();
      room.addWrongGuess(normalizedLetter);
    }

    room.word.split('').forEach((_letter, index) => {
      if (_letter === normalizedLetter) {
        room.letters[index] = _letter;
      }
    });

    const setup: SetupResponse = {
      room: {
        id: room.id,
        maxAttempts: room.maxAttempts,
        remainingAttempts: room.remainingAttempts ?? room.maxAttempts,
        wrongGuesses: room.wrongGuesses,
        correctGuesses: room.correctGuesses,
        letters: room.letters,
        wordLength: room.word.length,
        playerChoosesWord: room.playerChoosesWord?.id ?? null,
      },
    };

    io.in(room.id).emit('setup', setup);

    callback();
  });
});

http.listen(3333, () => console.log('> server is running'));
