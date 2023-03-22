import { RoomModel } from '../models/room.model.js';

export class RoomService {
  async createRoom(room) {
    return await RoomModel.create(room);
  }
}

export const roomsService = new RoomService();
