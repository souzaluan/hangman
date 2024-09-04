import { Entity } from './default';

interface RoomProps {
  id: string;
}

class Room extends Entity<Omit<RoomProps, 'id'>> {
  static create({ id, ...props }: RoomProps) {
    const room = new Room(props, id);
    return room;
  }
}

export default Room;
