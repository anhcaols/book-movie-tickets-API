import { SeatModel } from '../models/seat.model.js';

export class SeatService {
  async getAllSeatsByRoom(roomId, offset, limit) {
    return await SeatModel.findAll({ offset, limit, where: { room_id: roomId } });
  }

  async getSeatCountsByRoom(roomId) {
    return await SeatModel.count({ where: { room_id: roomId } });
  }

  async getSeatById(seatId) {
    return await SeatModel.findByPk(seatId);
  }

  async createSeat(seat) {
    await SeatModel.bulkCreate(seat);
  }

  async deleteSeatByRoom(roomId) {
    const seats = await SeatModel.findAll({
      where: { room_id: roomId },
    });

    seats.map(async (seat) => {
      await seat.destroy();
    });
  }
}

export const seatsService = new SeatService();
