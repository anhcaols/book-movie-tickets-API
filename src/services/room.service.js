import { RoomModel } from '../models/room.model.js';

export class RoomService {
  static async createRoom(room) {
    return await RoomModel.create(room);
  }
}
