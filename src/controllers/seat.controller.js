import { SeatSeatSchema } from '../dto/seat.js';
import { roomsService } from '../services/room.service.js';
import { seatTypesService } from '../services/seat-type.service.js';
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

    const existingSeats = await seatsService.getAllSeatsByRoom(value.room_id);
    if (existingSeats.length > 0) {
      return res.status(400).json({
        message: 'Seats for this room already exist',
        status: 400,
      });
    }

    const vipRows = value.row_vip;
    const seats = [];
    const seatTypes = await seatTypesService.getAllSeatTypes();
    const seatVipId = seatTypes.find((seatType) => seatType.type === 'vip').dataValues.id;
    const seatNormalId = seatTypes.find((seatType) => seatType.type === 'normal').dataValues.id;

    for (let i = 1; i <= room.dataValues.row_number; i++) {
      for (let j = 1; j <= room.dataValues.column_number; j++) {
        const isVip = vipRows.includes(i);
        seats.push({
          room_id: value.room_id,
          row_position: i,
          column_position: j,
          seat_type_id: isVip ? seatVipId : seatNormalId,
        });
      }
    }
    await seatsService.createSeat(seats);

    res.json({ message: 'Create seat successfully', success: true });
  } catch (e) {
    next(e);
  }
};
