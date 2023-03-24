import { SeatSeatSchema } from '../dto/seat.js';
import { roomsService } from '../services/room.service.js';
import { seatsService } from '../services/seat.service.js';

export const createSeatController = async (req, res, next) => {
  try {
    const { error, value } = SeatSeatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const room = await roomsService.getRoom(value.room_id);
    if (!room) {
      return res.status(404).json({
        message: 'Room does not found',
        status: 404,
      });
    }

    const seats = [];
    for (let i = 1; i <= room.dataValues.row_number; i++) {
      for (let j = 1; j <= room.dataValues.column_number; j++) {
        seats.push({
          room_id: value.room_id,
          row_position: i,
          column_position: j,
          price: 85000,
        });
      }
    }
    await seatsService.createSeat(seats);

    res.json({ message: 'Create seat successfully', success: true });
  } catch (e) {
    next(e);
  }
};
