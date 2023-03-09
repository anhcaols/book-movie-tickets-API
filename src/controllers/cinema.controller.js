import { CinemaSchema } from '../dto/cinema.js';
import { CinemaService } from '../services/cinema.service.js';

export const createCinemaController = async (req, res, next) => {
  try {
    const { error, value } = CinemaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    await CinemaService.createCinema(value);
    res.json({ message: 'Create cinema successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteCinemaController = async (req, res, next) => {
  try {
    const cinemaId = req.params.id;
    const cinema = await CinemaService.getCinemaById(cinemaId);
    if (!cinema) {
      return res.status(404).json({
        message: 'Cinema does not found',
      });
    }

    await CinemaService.deleteCinema(cinemaId);
    res.json({ message: 'Delete cinema successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateCinemaController = async (req, res, next) => {
  try {
    const { error, value } = CinemaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const cinemaId = req.params.id;
    const cinema = await CinemaService.getCinemaById(cinemaId);
    if (!cinema) {
      return res.status(404).json({
        message: 'Cinema does not found',
      });
    }

    await CinemaService.updateCinema(value, cinemaId);
    res.json({ message: 'Update cinema successfully', success: true });
  } catch (e) {
    next(e);
  }
};
