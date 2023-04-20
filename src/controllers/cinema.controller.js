import { CinemaSchema } from '../dto/cinema.js';
import { cinemasService } from '../services/cinema.service.js';
import { utils } from '../utils/index.js';

export const createCinemaController = async (req, res, next) => {
  try {
    const { error, value } = CinemaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const cinema = await cinemasService.createCinema(value);

    res.json({ message: 'Create cinema successfully', cinema: cinema.dataValues, success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteCinemaController = async (req, res, next) => {
  try {
    const cinemaId = req.params.id;
    const cinema = await cinemasService.getCinemaById(cinemaId);
    if (!cinema) {
      return res.status(404).json({
        message: 'Cinema does not found',
      });
    }

    await cinemasService.deleteCinema(cinemaId);
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
    const cinema = await cinemasService.getCinemaById(cinemaId);
    if (!cinema) {
      return res.status(404).json({
        message: 'Cinema does not found',
      });
    }

    await cinemasService.updateCinema(value, cinemaId);
    const newCinema = await cinemasService.getCinemaById(cinemaId);
    res.json({ message: 'Update cinema successfully', cinema: newCinema.dataValues, success: true });
  } catch (e) {
    next(e);
  }
};

export const getCinemasController = async (req, res, next) => {
  try {
    const totalDocs = await cinemasService.getCinemaCounts();
    const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
    const cinemas = await cinemasService.getCinemas(offset, limit);
    res.json({
      message: 'Get cinemas successfully',
      cinemas,
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

export const getCinemaController = async (req, res, next) => {
  try {
    const cinemaId = req.params.id;
    const cinema = await cinemasService.getCinemaById(cinemaId);
    if (!cinema) {
      return res.status(404).json({
        message: 'Cinema does not found',
      });
    }

    res.json({
      message: 'Get cinema successfully',
      cinema,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};
