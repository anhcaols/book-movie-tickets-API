import { Op } from 'sequelize';
import { ScheduleModel } from '../models/schedule.model.js';

export class ScheduleService {
  async getScheduleByRoom(roomId) {
    return await ScheduleModel.findAll({ where: { room_id: roomId } });
  }

  async getScheduleById(scheduleId) {
    return await ScheduleModel.findByPk(scheduleId);
  }

  async getAllSchedules(offset, limit) {
    return await ScheduleModel.findAll({ offset, limit });
  }

  async getScheduleCount() {
    return await ScheduleModel.count();
  }

  async createSchedule(schedule) {
    await ScheduleModel.create(schedule);
  }

  async deleteSchedule(scheduleId) {
    const schedule = await ScheduleModel.findByPk(scheduleId);
    if (schedule) {
      await schedule.destroy();
    }
  }

  async existingSchedule(roomId, startTime, endTime) {
    return await ScheduleModel.findOne({
      where: {
        room_id: roomId,
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            end_time: {
              [Op.between]: [startTime, endTime],
            },
          },
        ],
      },
    });
  }

  async updateSchedule(newSchedule, scheduleId) {
    return await ScheduleModel.update(newSchedule, {
      where: { id: scheduleId },
    });
  }
}

export const schedulesService = new ScheduleService();
