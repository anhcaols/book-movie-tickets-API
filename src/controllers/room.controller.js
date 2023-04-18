import { RoomSchema } from '../dto/room.js';
import { roomsService } from '../services/room.service.js';
import { seatsService } from '../services/seat.service.js';
import { utils } from '../utils/index.js';
import { cinemasService } from '../services/cinema.service.js';

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
    const room = await roomsService.getRoomById(roomId);
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

export const getRoomsController = async (req, res, next) => {
  try {
    const totalDocs = await roomsService.getRoomCounts();
    const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
    const rooms = await roomsService.getRooms(offset, limit);
    const data = await Promise.all(
      rooms.map(async (room) => {
        const cinema = await cinemasService.getCinemaById(room.dataValues.cinema_id);
        const { id, name, row_number, column_number } = room.dataValues;
        return {
          id,
          name,
          rowNumber: row_number,
          columnNumber: column_number,
          cinema: {
            id: cinema.dataValues.id,
            name: cinema.dataValues.name,
            address: cinema.dataValues.address,
          },
        };
      })
    );
    res.json({
      message: 'Get rooms successfully',
      rooms: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page,
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getRoomController = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await roomsService.getRoomById(roomId);
    if (!room) {
      return res.status(404).json({
        message: 'Room does not found',
      });
    }

    res.json({
      message: 'Get room successfully',
      room,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};
