import { Op, Sequelize } from 'sequelize';
import { ScheduleModel } from '../models/schedule.model.js';
import { DbService } from './db-service.js';

export class ScheduleService {
  async getScheduleByRoom(roomId) {
    return await ScheduleModel.findAll({ where: { room_id: roomId } });
  }

  async getScheduleById(scheduleId) {
    return await ScheduleModel.findByPk(scheduleId);
  }

  async getAllSchedules(offset, limit, dateTime, movieId) {
    if (dateTime) {
      const [year, month, day] = dateTime.split('-');
      const startDate = Sequelize.fn('date', Sequelize.literal(`'${year}-${month}-${day}'`));

      if (movieId) {
        return await ScheduleModel.findAll({
          offset,
          limit,
          order: [['id', 'DESC']],
          where: {
            start_time: {
              [Op.gte]: startDate,
            },
            movie_id: movieId,
          },
        });
      } else {
        return await ScheduleModel.findAll({
          offset,
          limit,
          order: [['id', 'DESC']],
          where: dateTime && {
            start_time: {
              [Op.gte]: startDate,
            },
          },
        });
      }
    } else {
      return await ScheduleModel.findAll({
        offset,
        limit,
        order: [['id', 'DESC']],
      });
    }
  }

  async getAllSchedulesByMovie(movieId, dateTime) {
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

  async getScheduleCount(dateTime, movieId) {
    if (dateTime) {
      const [year, month, day] = dateTime.split('-');
      const startDate = Sequelize.fn('date', Sequelize.literal(`'${year}-${month}-${day}'`));

      if (movieId) {
        return await ScheduleModel.count({
          where: {
            start_time: {
              [Op.gte]: startDate,
            },
            movie_id: movieId,
          },
        });
      } else {
        return await ScheduleModel.count({
          where: {
            start_time: {
              [Op.gte]: startDate,
            },
          },
        });
      }
    } else {
      return await ScheduleModel.count();
    }
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
