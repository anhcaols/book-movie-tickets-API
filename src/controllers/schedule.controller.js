import { GetAllSchedulesSchema, ScheduleSchema } from '../dto/schedule.js';
import { schedulesService } from '../services/schedule.service.js';
import { moviesService } from '../services/movie.service.js';
import { roomsService } from '../services/room.service.js';
import { cinemasService } from '../services/cinema.service.js';
import { statusSeatsService } from '../services/status-seat.service.js';

export const createScheduleController = async (req, res, next) => {
  try {
    const { error, value } = ScheduleSchema.validate(req.body);

    const movie = await moviesService.getMovieById(value.movie_id);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }
    const schedule = await schedulesService.existingSchedule(value.room_id, value.start_time, value.end_time);
    if (schedule) {
      return res.status(404).json({
        message: 'Existing schedule',
        status: 404,
      });
    }
    await schedulesService.createSchedule({ ...value, release_date: movie.dataValues.release_date });

    res.json({ message: 'Create schedule successfully', success: true });
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const getAllScheduleController = async (req, res, next) => {
  try {
    const { error, value } = GetAllSchedulesSchema.validate(req.body);

    const movie = await moviesService.getMovieById(value.movie_id);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }

    const room = await roomsService.getRoom(value.room_id);
    if (!room) {
      return res.status(404).json({
        message: 'Room does not found',
        status: 404,
      });
    }

    const cinema = await cinemasService.getCinemaById(room.dataValues.cinema_id);

    const schedules = await schedulesService.getAllSchedules(value.room_id, value.movie_id);
    const data = await Promise.all(
      schedules.map(async (schedule) => {
        return {
          id: schedule.dataValues.id,
          movieId: schedule.dataValues.movie_id,
          startTime: schedule.dataValues.start_time,
          endTime: schedule.dataValues.end_time,
          releaseDate: schedule.dataValues.release_date,
          room: {
            id: room.dataValues.id,
            roomName: room.dataValues.name,
            cinemaName: cinema.dataValues.name,
            cinemaAddress: cinema.dataValues.address,
          },
        };
      })
    );
    res.json({
      message: 'Get all schedules successfully',
      schedules: data,
      success: true,
    });
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const deleteScheduleController = async (req, res, next) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await statusSeatsService.getAllStatusSeat(scheduleId);
    console.log(schedule);
    if (schedule.length === 0) {
      return res.status(404).json({
        message: 'Schedule does not found',
        status: 404,
      });
    }

    await statusSeatsService.deleteStatusSeatBySchedule(scheduleId);
    await schedulesService.deleteSchedule(scheduleId);
    res.json({
      message: 'Delete schedules successfully',
      success: true,
    });
  } catch (e) {
    next(e);
  }
};
