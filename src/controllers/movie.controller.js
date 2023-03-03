import { MovieSchema } from '../dto/movie.js';
import { MovieService } from '../services/movie.service.js';
import fs from 'fs';

export const createMovieController = async (req, res, next) => {
  try {
    const { error, value } = MovieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    console.log(req.file);
    await MovieService.createMovie({ ...value, image: req.file.originalname });
    res.json({ message: 'Create movie successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await MovieService.getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
      });
    }
    const imageName = movie.dataValues.image;
    if (imageName) {
      fs.unlink(`public/images/${imageName}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    await MovieService.deleteMovie(movieId);

    res.json({ message: 'Delete movie successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateMovieController = async (req, res, next) => {
  try {
    const { error, value } = MovieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const movieId = req.params.id;
    const movie = await MovieService.getMovieById(movieId);
    if (!movie) {
      // neu khong co phim thi xoa anh di
      const imageName = req.file.filename;
      if (imageName) {
        fs.unlink(`public/images/${imageName}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }
      return res.status(404).json({
        message: 'Movie does not found',
      });
    }
    // xoa anh cu khi cap nhat anh moi
    const imageName = movie.dataValues.image;
    fs.unlink(`public/images/${imageName}`, (err) => {
      if (err) {
        throw err;
      }
    });
    await MovieService.updateMovie({ ...value, image: req.file.filename }, movieId);
    res.json({ message: 'Update genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};
