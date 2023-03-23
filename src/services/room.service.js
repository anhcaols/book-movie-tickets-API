import { RoomModel } from '../models/room.model.js';

export class RoomService {
  async getRoom(roomId) {
    return await RoomModel.findByPk(roomId);
  }

  async createRoom(room) {
    return await RoomModel.create(room);
  }

  async deleteRoom(roomId) {
    const room = await RoomModel.findByPk(roomId);
    if (room) {
      await room.destroy();
    }
  }
}

export const roomsService = new RoomService();
