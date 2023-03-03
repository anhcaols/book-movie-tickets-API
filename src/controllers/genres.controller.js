import { CreateGenreSchema, DeleteGenreSchema, updateGenreSchema } from '../dto/genres/index.js';
import { GenresService } from '../services/genres.service.js';

export const createGenderController = async (req, res, next) => {
  try {
    const { error, value } = CreateGenreSchema.validate(req.body);
    await GenresService.createGenre(value);
    res.json({ message: 'Create genre successfully', success: true });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const deleteGenderController = async (req, res, next) => {
  try {
    const { error } = DeleteGenreSchema.validate(req.body);
    const genreId = req.params.id;
    const genre = await GenresService.getGenderById(genreId);
    if (!genre) {
      return res.status(404).json({
        message: 'Genre does not found',
      });
    }

    await GenresService.deleteGenre(genreId);
    res.json({ message: 'Delete genre successfully', success: true });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const updateGenderController = async (req, res, next) => {
  try {
    const { error, value } = updateGenreSchema.validate(req.body);
    const genreId = req.params.id;
    const genre = await GenresService.getGenderById(genreId);
    if (!genre) {
      return res.status(404).json({
        message: 'Genre does not found',
      });
    }

    await GenresService.updateGenre(value, genreId);
    res.json({ message: 'Update genre successfully', success: true });
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  } catch (e) {
    next(e);
  }
};
