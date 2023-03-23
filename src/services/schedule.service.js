import { ScheduleModel } from '../models/schedule.model.js';

export class ScheduleService {
  async getScheduleByRoom(roomId) {
    return await ScheduleModel.findAll({ where: { room_id: roomId } });
  }

  async getScheduleById(scheduleId) {
    return await ScheduleModel.findByPk(scheduleId);
  }

  async createSchedule(schedule) {
    await ScheduleModel.create(schedule);
  }
}

export const schedulesService = new ScheduleService();
