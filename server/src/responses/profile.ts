import { PlayerType } from '../constants';

interface ProfileResponse {
  id: string;
  name: string;
  type: PlayerType;
}

export default ProfileResponse;
