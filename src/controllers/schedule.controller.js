import { GetAllSchedulesSchema, ScheduleSchema } from '../dto/schedule.js';
import { schedulesService } from '../services/schedule.service.js';
import { moviesService } from '../services/movie.service.js';
import { roomsService } from '../services/room.service.js';
import { cinemasService } from '../services/cinema.service.js';
import { statusSeatsService } from '../services/status-seat.service.js';
import moment from 'moment';
import { seatsService } from '../services/seat.service.js';

export const createScheduleController = async (req, res, next) => {
  try {
    const { error, value } = ScheduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

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

    // create status seats
    const seats = await seatsService.getAllSeatsByRoom(value.room_id);
    const schedules = await schedulesService.getScheduleByRoom(value.room_id);

    if (seats.length === 0) {
      return res.status(404).json({
        message: 'Seats not found',
        status: 404,
      });
    }

    if (schedules.length === 0) {
      return res.status(404).json({
        message: 'Schedules not found',
        status: 404,
      });
    }

    const statusSeats = [];
    for (const seat of seats) {
      for (const schedule of schedules) {
        // Check if the current seat has an existing status seat for the current schedule only
        const existingStatusSeat = await statusSeatsService.getStatusSeat(seat.dataValues.id, schedule.dataValues.id);

        if (!existingStatusSeat) {
          const newStatus = await statusSeatsService.createStatusSeat({
            seat_id: seat.dataValues.id,
            schedule_id: schedule.dataValues.id,
            status: 'available',
          });
          statusSeats.push(newStatus);
        }
      }
    }

    res.json({ message: 'Create schedule successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const getAllScheduleController = async (req, res, next) => {
  try {
    const { error, value } = GetAllSchedulesSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
    const limit = parseInt(req.query.limit) || 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    if (value.start_time) {
      value.start_time = moment(value.start_time).format();
    }
    const schedules = await schedulesService.getAllSchedules(offset, limit, value);
    const totalDocs = await schedulesService.getScheduleCount(value);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const data = await Promise.all(
      schedules.map(async (schedule) => {
        const room = await roomsService.getRoomById(schedule.dataValues.room_id);
        const cinema = await cinemasService.getCinemaById(room.dataValues.cinema_id);
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
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page: Number(page),
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getAllScheduleByMovieController = async (req, res, next) => {
  try {
    const { error, value } = GetAllSchedulesSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
    const schedules = await schedulesService.getAllSchedulesByMovie(value.movie_id);

    let cinemas = [];
    let rooms = [];
    await Promise.all(
      schedules.map(async (schedule) => {
        const room = await roomsService.getRoomById(schedule.dataValues.room_id);
        const cinema = await cinemasService.getCinemaById(room.dataValues.cinema_id);
        cinemas.push(cinema.dataValues);
        rooms.push(room.dataValues);
      })
    );

    const scheduleByRoom = {};
    schedules.forEach((schedule) => {
      const roomId = schedule.dataValues.room_id;
      const startTime = moment(schedule.dataValues.start_time).format();

      if (!scheduleByRoom[roomId]) {
        scheduleByRoom[roomId] = [];
      }

      scheduleByRoom[roomId].push({
        id: schedule.id,
        startTime,
      });
    });

    const uniqueCinemas = [];
    const getCinemas = () => {
      const tempObj = {};
      for (let i = 0; i < cinemas.length; i++) {
        const item = cinemas[i];
        const key = item.id + '|' + item.name + '|' + item.address;
        if (!tempObj[key]) {
          tempObj[key] = true;
          uniqueCinemas.push(item);
        }
      }
    };
    getCinemas();

    const uniqueRooms = [];
    const getRooms = () => {
      const tempObj = {};
      for (let i = 0; i < rooms.length; i++) {
        const item = rooms[i];
        const key = item.id + '|' + item.name + '|' + item.cinema_id;
        if (!tempObj[key]) {
          tempObj[key] = true;
          uniqueRooms.push(item);
        }
      }
    };
    getRooms();

    let scheduleList = [];
    await Promise.all(
      uniqueRooms.map(async (room) => {
        const roomId = room.id;
        const cinema = await cinemasService.getCinemaById(room.cinema_id);
        const schedules = scheduleByRoom[roomId] || [];
        scheduleList.push({
          movieId: value.movie_id,
          room: {
            id: roomId,
            roomName: room.name,
            cinemaName: cinema.dataValues.name,
            cinemaAddress: cinema.dataValues.address,
          },
          showTimes: schedules,
        });
      })
    );

    const filteredSchedulesByDate = scheduleList.filter((schedule) => {
      return schedule.showTimes.some((showTime) => {
        return showTime.startTime.startsWith(moment(value.date_time).format('YYYY-MM-DD'));
      });
    });

    const filteredSchedules = scheduleList.filter((schedule) => {
      const isMatchedDate = schedule.showTimes.some((showTime) => {
        return showTime.startTime.startsWith(moment(value.date_time).format('YYYY-MM-DD'));
      });
      const isMatchedCinema = schedule.room.cinemaName.includes(value.cinema_name);
      const isMatchedCity = schedule.room.cinemaAddress.includes(value.city);

      return isMatchedDate && isMatchedCinema && isMatchedCity;
    });

    res.json({
      message: 'Get all schedules successfully',
      schedules: filteredSchedulesByDate,
      filterSchedules: filteredSchedules,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteScheduleController = async (req, res, next) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await schedulesService.getScheduleById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        message: 'Schedule does not found',
        status: 404,
      });
    }

    await statusSeatsService.deleteStatusSeatBySchedule(scheduleId);
    await schedulesService.deleteSchedule(scheduleId);
    res.json({
      message: 'Delete schedule successfully',
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const updateScheduleController = async (req, res, next) => {
  try {
    const { error, value } = ScheduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const scheduleId = req.params.id;
    const schedule = await schedulesService.getScheduleById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        message: 'Schedule does not found',
        status: 404,
      });
    }

    await schedulesService.updateSchedule(value, scheduleId);
    res.json({
      message: 'Update schedule successfully',
      success: true,
    });
  } catch (e) {
    next(e);
  }
};
