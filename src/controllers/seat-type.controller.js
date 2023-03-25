import { SeatTypeSchema } from '../dto/seat-type.js';
import { seatTypesService } from '../services/seat-type.service.js';

export const createSeatTypeController = async (req, res, next) => {
  try {
    const { error, value } = SeatTypeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
    await seatTypesService.createSeatType(value);

    res.json({ message: 'Create seat type successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteSeatTypeController = async (req, res, next) => {
  try {
    const seatTypeId = req.params.id;
    const seatType = await seatTypesService.getSeatType(seatTypeId);
    if (!seatType) {
      return res.status(404).json({
        message: 'Seat type does not found',
        status: 404,
      });
    }
    await seatTypesService.deleteSeatType(seatTypeId);

    res.json({ message: 'Create seat type successfully', success: true });
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
    await seatTypesService.updateSeatType(seatTypeId, value);

    res.json({ message: 'Update seat type successfully', success: true });
  } catch (e) {
    next(e);
  }
};
