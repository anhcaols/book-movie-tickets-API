import { SeatSeatSchema } from '../dto/seat.js';
import { roomsService } from '../services/room.service.js';
import { seatTypesService } from '../services/seat-type.service.js';
import { seatsService } from '../services/seat.service.js';
import { cinemasService } from '../services/cinema.service.js';
import { utils } from '../utils/index.js';

export const createSeatController = async (req, res, next) => {
  try {
    const { error, value } = SeatSeatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const room = await roomsService.getRoomById(value.room_id);
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
    const seatTypes = await seatTypesService.getSeatTypes();
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
    const newSeats = await seatsService.createSeat(seats);
    const data = await Promise.all(
      newSeats.map(async (seat) => {
        const { id, seat_type_id, room_id, row_position, column_position } = seat.dataValues;
        const seatType = await seatTypesService.getSeatTypeById(seat_type_id);
        const room = await roomsService.getRoomById(room_id);
        const cinema = await cinemasService.getCinemaById(room.dataValues.cinema_id);
        return {
          id,
          seatType: {
            id: seat_type_id,
            type: seatType.dataValues.type,
          },
          room: {
            id: room_id,
            name: room.dataValues.name,
            cinema: {
              id: cinema.dataValues.id,
              name: cinema.dataValues.name,
            },
          },
          rowPosition: row_position,
          columnPosition: column_position,
        };
      })
    );

    res.json({ message: 'Create seat successfully', seats: data, success: true });
  } catch (e) {
    next(e);
  }
};

export const getSeatByRoomController = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await roomsService.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({
        message: 'Room does not found',
        status: 404,
      });
    }
    const totalDocs = await seatsService.getSeatCountsByRoom(roomId);
    const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
    const seats = await seatsService.getAllSeatsByRoom(roomId, offset, limit);

    const data = await Promise.all(
      seats.map(async (seat) => {
        const { id, seat_type_id, room_id, row_position, column_position } = seat.dataValues;
        const seatType = await seatTypesService.getSeatTypeById(seat_type_id);
        const room = await roomsService.getRoomById(room_id);
        const cinema = await cinemasService.getCinemaById(room.dataValues.cinema_id);
        return {
          id,
          seatType: {
            id: seat_type_id,
            type: seatType.dataValues.type,
          },
          room: {
            id: room_id,
            name: room.dataValues.name,
            cinema: {
              id: cinema.dataValues.id,
              name: cinema.dataValues.name,
            },
          },
          rowPosition: row_position,
          columnPosition: column_position,
        };
      })
    );
    res.json({
      message: 'Get seat by room successfully',
      seats: data,
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
