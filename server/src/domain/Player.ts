import { PlayerType } from '../constants';

interface Player {
  id: string;
  name: string;
  type: PlayerType;
  roomCode: string;
}

export default Player;
