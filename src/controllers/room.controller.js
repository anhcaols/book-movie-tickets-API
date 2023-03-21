import { RoomSchema } from '../dto/room.js';
import { RoomService } from '../services/room.service.js';
import { SeatService } from '../services/seat.service.js';

export const createRoomController = async (req, res, next) => {
  try {
    const { error, value } = RoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const newRoom = await RoomService.createRoom(value);
    const seats = [];
    for (let i = 1; i <= value.row_number; i++) {
      for (let j = 1; j <= value.column_number; j++) {
        seats.push({
          room_id: newRoom.dataValues.id,
          row_position: i,
          column_position: j,
          status: 0,
          price: 85000,
        });
      }
    }
    await SeatService.createSeat(seats);

    res.json({ message: 'Create room successfully', success: true });
  } catch (e) {
    next(e);
  }
};
