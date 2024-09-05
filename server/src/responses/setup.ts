import { PlayerType } from '../constants';

interface SetupResponse {
  room: {
    id: string;
    maxAttempts: number;
  };
  me: {
    id: string;
    name: string;
    type: PlayerType;
  };
}

export default SetupResponse;
