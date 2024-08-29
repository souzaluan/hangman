import { RoomStatus } from '../constants/RoomStatus';

export interface Room {
  owner: string;
  status: RoomStatus;
  opponents: string[];
  word?: string;
}
