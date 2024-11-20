export enum NotificationType {
  Success,
}

export enum PlayerType {
  Admin,
  Guest,
}

export interface NotificationResponse {
  type: NotificationType;
  message: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  type: PlayerType;
}

export interface SetupResponse {
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
