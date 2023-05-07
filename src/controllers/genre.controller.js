import { GenreSchema } from '../dto/genre.js';
import { genresService } from '../services/genre.service.js';
import { utils } from '../utils/index.js';

export const createGenderController = async (req, res, next) => {
  try {
    const { error, value } = GenreSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    await genresService.createGenre(value);
    res.json({ message: 'Create genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteGenderController = async (req, res, next) => {
  try {
    const genreId = req.params.id;
    const genre = await genresService.getGenreById(genreId);
    if (!genre) {
      return res.status(404).json({
        message: 'Genre does not found',
        status: 404,
      });
    }

    await genresService.deleteGenre(genreId);
    res.json({ message: 'Delete genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateGenderController = async (req, res, next) => {
  try {
    const { error, value } = GenreSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const genreId = req.params.id;
    const genre = await genresService.getGenreById(genreId);
    if (!genre) {
      return res.status(404).json({
        message: 'Genre does not found',
        status: 400,
      });
    }

    await genresService.updateGenre(value, genreId);
    res.json({ message: 'Update genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const getGendersController = async (req, res, next) => {
  try {
    const totalDocs = await genresService.getGenreCounts();
    const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
    const genres = await genresService.getGenres(offset, limit);

    res.json({
      message: 'Get genres successfully',
      genres,
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
