import { StatusSeatSchema, UpdateStatusSeatSchema, GetAllStatusSeatSchema } from '../dto/status-seat.js';
import { schedulesService } from '../services/schedule.service.js';
import { seatsService } from '../services/seat.service.js';
import { statusSeatsService } from '../services/status-seat.service.js';

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

    const statusSeats = await statusSeatsService.getAllStatusSeat(value.schedule_id);
    const data = await Promise.all(
      statusSeats.map(async (statusSeat) => {
        const seat = await seatsService.getSeat(statusSeat.dataValues.seat_id);
        return {
          id: statusSeat.dataValues.id,
          seatId: statusSeat.seat_id,
          scheduleId: statusSeat.schedule_id,
          status: statusSeat.status,
          roomId: seat.dataValues.room_id,
          rowPosition: seat.dataValues.row_position,
          columnPosition: seat.dataValues.column_position,
        };
      })
    );
    res.json({ message: 'Get all status seat successfully', statusSeats: data, success: true });
  } catch (e) {
    next(e);
  }
};
