import { SeatModel } from '../models/seat.model.js';

export class SeatService {
  async createSeat(seat) {
    await SeatModel.bulkCreate(seat);
  }
}

export const seatsService = new SeatService();
