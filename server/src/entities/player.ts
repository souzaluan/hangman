import { PlayerType } from '../constants';

import { Entity } from './default';

interface PlayerProps {
  id: string;
  name: string;
  type: PlayerType;
  roomCode: string;
}

class Player extends Entity<Omit<PlayerProps, 'id'>> {
  get name() {
    return this.props.name;
  }

  get type() {
    return this.props.type;
  }

  get roomCode() {
    return this.props.roomCode;
  }

  static create({ id, ...props }: PlayerProps) {
    const player = new Player(props, id);
    return player;
  }
}

export default Player;
