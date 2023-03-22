import { ScheduleModel } from '../models/schedule.model.js';

export class ScheduleService {
  async createSchedule(schedule) {
    await ScheduleModel.create(schedule);
  }
}

export const schedulesService = new ScheduleService();
