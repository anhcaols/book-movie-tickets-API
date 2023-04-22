import { SeatTypeModel } from '../models/seat-type.model.js';

export class SeatTypeService {
  async getSeatTypes() {
    return await SeatTypeModel.findAll();
  }

  async getSeatTypeById(seatTypeId) {
    return await SeatTypeModel.findByPk(seatTypeId);
  }

  async getSeatTypeByType(seatType) {
    return await SeatTypeModel.findOne({ where: { type: seatType } });
  }

  async getSeatType(seatTypeId) {
    return await SeatTypeModel.findByPk(seatTypeId);
  }

  async getSeatTypeCounts() {
    return await SeatTypeModel.count();
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
