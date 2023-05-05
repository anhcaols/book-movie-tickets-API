import { Op } from 'sequelize';
import { ScheduleModel } from '../models/schedule.model.js';
import { DbService } from './db-service.js';

export class ScheduleService {
  async getScheduleByRoom(roomId) {
    return await ScheduleModel.findAll({ where: { room_id: roomId } });
  }

  async getScheduleById(scheduleId) {
    return await ScheduleModel.findByPk(scheduleId);
  }

  async getAllSchedules(offset, limit, condition) {
    return await ScheduleModel.findAll({
      offset,
      limit,
      order: [['id', 'DESC']],
      where: condition,
    });
  }

  async getAllSchedulesByMovie(movieId, dateTime) {
    console.log(dateTime);
    return await ScheduleModel.findAll({
      where: {
        movie_id: movieId,
        start_time: DbService.sequelize.where(
          DbService.sequelize.fn('date', DbService.sequelize.col('start_time')),
          dateTime
        ),
      },
    });
  }

  async getScheduleCount(condition) {
    return await ScheduleModel.count({
      where: condition,
    });
  }

  async createSchedule(schedule) {
    return await ScheduleModel.create(schedule);
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
