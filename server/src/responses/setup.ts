interface SetupResponse {
  room: {
    id: string;
    maxAttempts: number;
    remainingAttempts: number;
    wrongGuesses: string[];
    correctGuesses: string[];
    letters: string[];
    wordLength: number;
    playerChoosesWord: string | null;
    isPlaying: boolean;
  };
}

export default SetupResponse;
