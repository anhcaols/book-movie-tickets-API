import { SeatTypeModel } from '../models/seat-type.model.js';

export class SeatTypeService {
  async getAllSeatTypes() {
    return await SeatTypeModel.findAll();
  }

  async getSeatType(seatTypeId) {
    return await SeatTypeModel.findByPk(seatTypeId);
  }

  async createSeatType(seatType) {
    return await SeatTypeModel.create(seatType);
  }

  async deleteSeatType(seatTypeId) {
    const seatType = await SeatTypeModel.findByPk(seatTypeId);
    if (seatType) {
      await seatType.destroy();
    }
  }

  async updateSeatType(seatTypeId, newSeatType) {
    return await SeatTypeModel.update(newSeatType, {
      where: { id: seatTypeId },
    });
  }
}

export const seatTypesService = new SeatTypeService();
