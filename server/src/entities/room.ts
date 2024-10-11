import { Word } from '../value-objects';
import { Entity } from './default';
import Player from './player';

interface RoomProps {
  id: string;
  maxAttempts: number;
  remainingAttempts?: number;
  correctGuesses?: string[];
  wrongGuesses?: string[];
  letters?: string[];
  playerChoosesWord?: Player | null;
  word?: string | null;
}

class Room extends Entity<Omit<RoomProps, 'id'>> {
  get word(): string | null {
    return this.props.word ?? null;
  }

  set word(word: string) {
    this.props.word = word;
  }

  get maxAttempts() {
    return this.props.maxAttempts;
  }

  set maxAttempts(value) {
    this.props.maxAttempts = value;
  }

  get remainingAttempts() {
    return this.props.remainingAttempts;
  }

  set remainingAttempts(value) {
    this.props.remainingAttempts = value;
  }

  get correctGuesses() {
    return this.props.correctGuesses ?? [];
  }

  get wrongGuesses() {
    return this.props.wrongGuesses ?? [];
  }

  get letters() {
    return this.props.letters ?? [];
  }

  set letters(positions: string[]) {
    this.props.letters = positions;
  }

  get playerChoosesWord(): Player | null {
    return this.props.playerChoosesWord ?? null;
  }

  set playerChoosesWord(player: Player) {
    this.props.playerChoosesWord = player;
  }

  addCorrectGuess(guess: string) {
    if (!this.props.correctGuesses) {
      this.props.correctGuesses = [];
    }
    this.props.correctGuesses.push(guess);
  }

  addWrongGuess(guess: string) {
    if (!this.props.wrongGuesses) {
      this.props.wrongGuesses = [];
    }
    this.props.wrongGuesses?.push(guess);
  }

  decrementRemainingAttempts() {
    this.props.remainingAttempts = Math.max(
      (this.props.remainingAttempts ?? this.props.maxAttempts) - 1,
      0
    );
  }

  reset(props?: Partial<Omit<RoomProps, 'id'>>) {
    this.props = {
      maxAttempts: 5,
      remainingAttempts: 5,
      correctGuesses: [],
      wrongGuesses: [],
      letters: [],
      playerChoosesWord: null,
      word: null,
      ...props,
    };
  }

  static create({ id, ...props }: RoomProps) {
    const room = new Room(props, id);
    return room;
  }
}

export default Room;
