import { SeatTypeSchema } from '../dto/seat-type.js';
import { seatTypesService } from '../services/seat-type.service.js';
import { utils } from '../utils/index.js';

export const createSeatTypeController = async (req, res, next) => {
  try {
    const { error, value } = SeatTypeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const existingSeatType = await seatTypesService.getSeatTypeByType(value.type);
    if (existingSeatType) {
      return res.status(404).json({
        message: 'Existing seat type',
        status: 404,
      });
    }

    const seatType = await seatTypesService.createSeatType(value);

    res.json({ message: 'Create seat type successfully', seatType, success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteSeatTypeController = async (req, res, next) => {
  try {
    // const seatTypeId = req.params.id;
    // const seatType = await seatTypesService.getSeatType(seatTypeId);
    // if (!seatType) {
    //   return res.status(404).json({
    //     message: 'Seat type does not found',
    //     status: 404,
    //   });
    // }
    // await seatsService.getAllSeatsByRoom();
    // await seatTypesService.deleteSeatType(seatTypeId);
    // res.json({ message: 'Create seat type successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateSeatTypeController = async (req, res, next) => {
  try {
    const seatTypeId = req.params.id;
    const { error, value } = SeatTypeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const seatType = await seatTypesService.getSeatType(seatTypeId);
    if (!seatType) {
      return res.status(404).json({
        message: 'Seat type does not found',
        status: 404,
      });
    }

    // const existingSeatType = await seatTypesService.getSeatTypeByType(value.type);
    // if (existingSeatType) {
    //   return res.status(404).json({
    //     message: 'Existing seat type',
    //     status: 404,
    //   });
    // }

    await seatTypesService.updateSeatType(seatTypeId, value);

    const newSeatType = await seatTypesService.getSeatTypeById(seatTypeId);

    res.json({ message: 'Update seat type successfully', newSeatType, success: true });
  } catch (e) {
    next(e);
  }
};

export const getSeatTypesController = async (req, res, next) => {
  try {
    const totalDocs = await seatTypesService.getSeatTypeCounts();
    const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
    const seatTypes = await seatTypesService.getSeatTypes(offset, limit);
    res.json({
      message: 'Get seat types successfully',
      seatTypes,
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

export const getSeatTypeController = async (req, res, next) => {
  try {
    const seatTypeId = req.params.id;
    const seatType = await seatTypesService.getSeatTypeById(seatTypeId);
    if (!seatType) {
      return res.status(404).json({
        message: 'Seat type does not found',
        status: 404,
      });
    }

    res.json({
      message: 'Get seat type successfully',
      seatType,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};
