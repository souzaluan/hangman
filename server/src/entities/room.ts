import { Entity } from './default';
import Player from './player';

interface RoomProps {
  id: string;
  playerChoosesWord?: Player;
  word?: string;
}

class Room extends Entity<Omit<RoomProps, 'id'>> {
  set playerChoosesWord(player: Player) {
    this.props.playerChoosesWord = player;
  }

  set word(word: string) {
    this.props.word = word.toUpperCase();
  }

  get word() {
    return this.props.word ?? '';
  }

  static create({ id, ...props }: RoomProps) {
    const room = new Room(props, id);
    return room;
  }
}

export default Room;
