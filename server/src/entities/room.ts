import { Entity } from './default';
import Player from './player';

interface RoomProps {
  id: string;
  maxAttempts: number;
  remainingAttempts?: number;
  correctGuesses?: string[];
  wrongGuesses?: string[];
  letters?: string[];
  playerChoosesWord?: Player;
  word?: string;
}

class Room extends Entity<Omit<RoomProps, 'id'>> {
  get word() {
    return this.props.word ?? '';
  }

  set word(word: string) {
    this.props.word = word
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .toUpperCase();
  }

  get maxAttempts() {
    return this.props.maxAttempts;
  }

  get remainingAttempts() {
    return this.props.remainingAttempts;
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

  static create({ id, ...props }: RoomProps) {
    const room = new Room(props, id);
    return room;
  }
}

export default Room;
