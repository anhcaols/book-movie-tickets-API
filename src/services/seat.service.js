import { SeatModel } from '../models/seat.model.js';

export class SeatService {
  async getAllSeatsByRoom(roomId) {
    return await SeatModel.findAll({ where: { room_id: roomId } });
  }

  async getSeat(seatId) {
    return await SeatModel.findByPk(seatId);
  }

  async createSeat(seat) {
    await SeatModel.bulkCreate(seat);
  }

  async deleteSeat(roomId) {
    const seats = await SeatModel.findAll({
      where: { room_id: roomId },
    });

    seats.map(async (seat) => {
      await seat.destroy();
    });
  }
}

export const seatsService = new SeatService();
