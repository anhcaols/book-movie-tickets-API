import { GenreSchema } from '../dto/genre.js';
import { GenresService } from '../services/genre.service.js';

export const createGenderController = async (req, res, next) => {
  try {
    const { error, value } = GenreSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    await GenresService.createGenre(value);
    res.json({ message: 'Create genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteGenderController = async (req, res, next) => {
  try {
    const genreId = req.params.id;
    const genre = await GenresService.getGenreById(genreId);
    if (!genre) {
      return res.status(404).json({
        message: 'Genre does not found',
        status: 404,
      });
    }

    await GenresService.deleteGenre(genreId);
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
    const genre = await GenresService.getGenreById(genreId);
    if (!genre) {
      return res.status(404).json({
        message: 'Genre does not found',
        status: 400,
      });
    }

    await GenresService.updateGenre(value, genreId);
    res.json({ message: 'Update genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};
