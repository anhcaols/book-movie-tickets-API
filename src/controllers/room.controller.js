import { RoomSchema } from '../dto/room.js';
import { roomsService } from '../services/room.service.js';
import { seatsService } from '../services/seat.service.js';

export const createRoomController = async (req, res, next) => {
  try {
    const { error, value } = RoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    await roomsService.createRoom(value);
    res.json({ message: 'Create room successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteRoomController = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await roomsService.getRoom(roomId);
    if (!room) {
      return res.status(404).json({
        message: 'Room does not found',
        status: 404,
      });
    }
    await seatsService.deleteSeat(roomId);
    await roomsService.deleteRoom(roomId);
    res.json({ message: 'Delete room successfully', success: true });
  } catch (e) {
    next(e);
  }
};
