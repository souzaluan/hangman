import { PlayerType } from '../constants';

interface SetupResponse {
  room: {
    id: string;
    maxAttempts: number;
    remainingAttempts: number;
    wrongGuesses: string[];
    correctGuesses: string[];
    letters: string[];
    wordLength: number;
  };
  me: {
    id: string;
    name: string;
    type: PlayerType;
  };
}

export default SetupResponse;
