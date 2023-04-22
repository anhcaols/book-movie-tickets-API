import moment from 'moment';
import { StatusSeatSchema, UpdateStatusSeatSchema, GetAllStatusSeatSchema } from '../dto/status-seat.js';
import { schedulesService } from '../services/schedule.service.js';
import { seatsService } from '../services/seat.service.js';
import { statusSeatsService } from '../services/status-seat.service.js';
import { moviesService } from '../services/movie.service.js';
import { roomsService } from '../services/room.service.js';
import { seatTypesService } from '../services/seat-type.service.js';
import { utils } from '../utils/index.js';

export const createStatusSeatController = async (req, res, next) => {
  try {
    const { error, value } = StatusSeatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

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

    res.json({ message: 'Create status seat successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateStatusSeatController = async (req, res, next) => {
  try {
    const { error, value } = UpdateStatusSeatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const existingStatusSeat = await statusSeatsService.getStatusSeat(value.seat_id, value.schedule_id);
    if (!existingStatusSeat) {
      return res.status(404).json({
        message: 'Status seat not found',
        status: 404,
        success: false,
      });
    }
    const newStatusSeat = await statusSeatsService.updateStatusSeat(value.seat_id, value.schedule_id, value.status);

    res.json({ message: 'Update status seat successfully', statusSeat: newStatusSeat.dataValues, success: true });
  } catch (e) {
    next(e);
  }
};

export const getAllStatusSeatController = async (req, res, next) => {
  try {
    const { error, value } = GetAllStatusSeatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const schedule = await schedulesService.getScheduleById(value.schedule_id);
    if (!schedule) {
      return res.status(404).json({
        message: 'Schedule not found',
        status: 404,
        success: false,
      });
    }

    const totalDocs = await statusSeatsService.getCountStatusSeat(value.schedule_id);
    const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
    const statusSeats = await statusSeatsService.getAllStatusSeat(offset, limit, value.schedule_id);
    const movie = await moviesService.getMovieById(schedule.dataValues.movie_id);

    const data = await Promise.all(
      statusSeats.map(async (statusSeat) => {
        const seat = await seatsService.getSeatById(statusSeat.dataValues.seat_id);
        const seatType = await seatTypesService.getSeatTypeById(seat.dataValues.seat_type_id);
        const room = await roomsService.getRoomById(seat.dataValues.room_id);
        return {
          id: statusSeat.dataValues.id,
          seatId: statusSeat.seat_id,
          schedule: {
            id: statusSeat.schedule_id,
            movie: {
              id: movie.dataValues.id,
              name: movie.dataValues.name,
            },
            showTime: moment(schedule.dataValues.start_time).format(),
          },
          status: statusSeat.status,
          seatType: seatType.dataValues.type,
          price: seatType.dataValues.price,
          room: {
            id: room.dataValues.id,
            name: room.dataValues.name,
          },
          rowPosition: seat.dataValues.row_position,
          columnPosition: seat.dataValues.column_position,
        };
      })
    );
    res.json({
      message: 'Get all status seat successfully',
      statusSeats: data,
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
