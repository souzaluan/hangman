import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'node:crypto';
import { PlayerType } from './constants';
import { Player, Room } from './entities';
import { SuccessNotification } from './notifications';
import { ProfileResponse, SetupResponse } from './responses';
import { Word } from './value-objects';

const app = express();

const http = createServer(app);

const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let players: Player[] = [];
let rooms: Room[] = [];

io.on('connection', (socket) => {
  console.log('> new connection: ', socket.id);

  socket.on('create-room', () => {
    console.log('> create room');

    const generateCode = () => {
      const letters = String.fromCharCode(
        65 + Math.floor(Math.random() * 26),
        65 + Math.floor(Math.random() * 26)
      );

      const digits = Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0');

      const code = letters + digits;

      const roomWithSameCode = rooms.find((_room) => _room.id === code);

      if (roomWithSameCode) return generateCode();

      return code;
    };

    const roomCode = generateCode();

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
        wordLength: room.word?.length ?? 0,
        playerChoosesWord: null,
        isPlaying: false,
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

    const isLoser = room.wrongGuesses.length === room.maxAttempts;
    const isWinner =
      room.letters.filter((_letter) => _letter !== '_').length ===
        room.word?.length ?? 0;

    const isFinished = isLoser || isWinner;

    if (!room.word || (room.word && isFinished)) {
      const playerChoosesWord = room.playerChoosesWord ?? playersInRoom[0];
      room.playerChoosesWord = playerChoosesWord;
      socket.to(playerChoosesWord.id).emit('choose-word');
    }

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
        wordLength: room.word?.length ?? 0,
        playerChoosesWord: room.playerChoosesWord?.id ?? null,
        isPlaying: !isFinished,
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

  socket.on('leave-room', (callback) => {
    console.log('> leave room');

    const player = players.find((_player) => _player.id === socket.id);

    const room = rooms.find((_room) => _room.id === player?.roomCode);

    if (!room || !player) return callback('Ops, ocorreu um erro.');

    const restPlayers = players.filter((_player) => _player.id !== socket.id);
    players = restPlayers;

    socket.emit('leave-room');

    socket
      .in(room.id)
      .emit('notification', new SuccessNotification(`${player.name} left!`));

    const playerStayedInRoom = players.find(
      (_player) => _player.roomCode === room.id
    );

    if (!playerStayedInRoom) {
      const restRooms = rooms.filter((_room) => _room.id !== room.id);
      rooms = restRooms;
      return;
    }

    const setup: SetupResponse = {
      room: {
        id: room.id,
        maxAttempts: room.maxAttempts,
        remainingAttempts: room.remainingAttempts ?? room.maxAttempts,
        wrongGuesses: room.wrongGuesses,
        correctGuesses: room.correctGuesses,
        letters: room.letters,
        wordLength: room.word?.length ?? 0,
        playerChoosesWord: playerStayedInRoom.id,
        isPlaying: true,
      },
    };

    const playerStayedInRoomProfile: ProfileResponse = {
      id: playerStayedInRoom.id,
      name: playerStayedInRoom.name,
      type: PlayerType.Admin,
    };

    socket.in(room.id).emit('setup', setup);
    socket.to(playerStayedInRoom.id).emit('profile', playerStayedInRoomProfile);
    io.to(player.id).socketsLeave(room.id);

    callback();
  });

  socket.on(
    'set-word',
    ({ roomCode, word }: { roomCode: string; word: string }, callback) => {
      console.log('> set word');

      const player = players.find((_player) => _player.id === socket.id);

      const room = rooms.find((_room) => _room.id === roomCode);

      if (!room || !player) return callback('Ops, ocorreu um erro.');

      const newRoomWord = new Word(word);

      room.reset({
        letters: Array.from({ length: newRoomWord.value.length }, () => '_'),
        playerChoosesWord: player,
        word: newRoomWord.value,
      });

      const setup: SetupResponse = {
        room: {
          id: room.id,
          maxAttempts: room.maxAttempts,
          remainingAttempts: room.maxAttempts,
          wrongGuesses: room.wrongGuesses,
          correctGuesses: room.correctGuesses,
          letters: room.letters,
          wordLength: newRoomWord.value.length,
          playerChoosesWord: room.playerChoosesWord?.id ?? null,
          isPlaying: true,
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
    const isCorrectGuess = room.word?.includes(normalizedLetter);

    if (isCorrectGuess) {
      room.addCorrectGuess(normalizedLetter);
    } else {
      room.decrementRemainingAttempts();
      room.addWrongGuess(normalizedLetter);
    }

    room.word?.split('').forEach((_letter, index) => {
      if (_letter === normalizedLetter) {
        room.letters[index] = _letter;
      }
    });

    const isLoser = room.wrongGuesses.length === room.maxAttempts;
    const isWinner =
      room.letters.filter((_letter) => _letter !== '_').length ===
      room.word?.length;

    const setup: SetupResponse = {
      room: {
        id: room.id,
        maxAttempts: room.maxAttempts,
        remainingAttempts: room.remainingAttempts ?? room.maxAttempts,
        wrongGuesses: room.wrongGuesses,
        correctGuesses: room.correctGuesses,
        letters: room.letters,
        wordLength: room.word?.length ?? 0,
        playerChoosesWord: room.playerChoosesWord?.id ?? null,
        isPlaying: true,
      },
    };

    io.in(room.id).emit('setup', setup);

    if (isLoser) {
      socket.emit('is-loser');
      socket.in(room.id).emit('is-winner');
    }

    if (isWinner) {
      socket.emit('is-winner');
      socket.in(room.id).emit('is-loser');
    }

    callback();
  });

  socket.on('play-again', (callback) => {
    console.log('> play-again');

    const player = players.find((_player) => _player.id === socket.id);

    const room = rooms.find((_room) => _room.id === player?.roomCode);

    const nextChoosesWordPlayer = players.find(
      (_player) =>
        _player.roomCode === room?.id &&
        _player.id !== room?.playerChoosesWord?.id
    );

    if (!room || !player || !nextChoosesWordPlayer)
      return callback('Ops, ocorreu um erro.');

    io.to(nextChoosesWordPlayer.id).emit('choose-word');

    room.reset({ playerChoosesWord: nextChoosesWordPlayer });

    const setup: SetupResponse = {
      room: {
        id: room.id,
        maxAttempts: room.maxAttempts,
        remainingAttempts: room.remainingAttempts ?? room.maxAttempts,
        wrongGuesses: room.wrongGuesses,
        correctGuesses: room.correctGuesses,
        letters: room.letters,
        wordLength: room.word?.length ?? 0,
        playerChoosesWord: nextChoosesWordPlayer.id,
        isPlaying: true,
      },
    };

    io.in(room.id).emit('setup', setup);

    callback();
  });
});

http.listen(3333, () => console.log('> server is running'));
