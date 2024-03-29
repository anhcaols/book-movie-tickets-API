import { RoomModel } from '../models/room.model.js';

export class RoomService {
  async getRooms(offset, limit) {
    return await RoomModel.findAll({ offset, limit, order: [['id', 'DESC']] });
  }

  async getRoomCounts() {
    return await RoomModel.count();
  }

  async getRoomById(roomId) {
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

  async deleteRoomByCinema(cinemaId) {
    const rooms = await RoomModel.findAll({
      where: { cinema_id: cinemaId },
    });

    rooms.map(async (room) => {
      await room.destroy();
    });
  }
}

export const roomsService = new RoomService();
