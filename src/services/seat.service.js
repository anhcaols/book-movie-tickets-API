import { SeatModel } from '../models/seat.model.js';

export class SeatService {
  static async createSeat(seat) {
    await SeatModel.bulkCreate(seat);
  }
}
