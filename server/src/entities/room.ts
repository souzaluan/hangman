import { Entity } from './default';
import Player from './player';

interface RoomProps {
  id: string;
  playerChoosesWord?: Player;
}

class Room extends Entity<Omit<RoomProps, 'id'>> {
  set playerChoosesWord(player: Player) {
    this.props.playerChoosesWord = player;
  }

  static create({ id, ...props }: RoomProps) {
    const room = new Room(props, id);
    return room;
  }
}

export default Room;
