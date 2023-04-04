import { StatusSeatModel } from '../models/status-seat.model.js';

export class StatusSeatService {
  async getStatusSeat(seatId, scheduleId) {
    return await StatusSeatModel.findOne({ where: { seat_id: seatId, schedule_id: scheduleId } });
  }

  async getAllStatusSeat(offset, limit, scheduleId) {
    return await StatusSeatModel.findAll({ offset, limit, where: { schedule_id: scheduleId } });
  }

  async getCountStatusSeat(scheduleId) {
    return await StatusSeatModel.count({ where: { schedule_id: scheduleId } });
  }

  async createStatusSeat(statusSeat) {
    await StatusSeatModel.create(statusSeat);
  }

  async updateStatusSeat(seatId, scheduleId, newStatus) {
    return await StatusSeatModel.update(
      { status: newStatus },
      {
        where: { seat_id: seatId, schedule_id: scheduleId },
      }
    );
  }

  async deleteStatusSeatBySchedule(scheduleId) {
    const statusSeat = await StatusSeatModel.findAll({
      where: { schedule_id: scheduleId },
    });
    statusSeat.map(async (scheduleId) => {
      await scheduleId.destroy();
    });
  }
}

export const statusSeatsService = new StatusSeatService();
