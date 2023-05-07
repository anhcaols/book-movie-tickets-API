import { GenresModel } from '../models/genre.model.js';
import { MovieGenreModel } from '../models/movie-genre.model.js';
import { MovieModel } from '../models/movie.model.js';

export class MovieService {
  async getMovies(offset, limit, condition) {
    return await MovieModel.findAll({
      offset,
      limit,
      where: condition,
      order: [['id', 'DESC']],
      include: {
        model: GenresModel,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });
  }

  async getMoviesCount(condition) {
    return await MovieModel.count({
      where: condition,
    });
  }

  async getMovieById(movieId) {
    return await MovieModel.findOne({
      where: {
        id: movieId,
      },
    });
  }

  async getMovieBySlug(slug) {
    return await MovieModel.findOne({
      where: {
        slug: slug,
      },
    });
  }

  async createMovie(movie) {
    return await MovieModel.create(movie);
  }

  async deleteMovie(movieId) {
    const movie = await MovieModel.findOne({
      where: { id: movieId },
    });
    if (movie) {
      await movie.destroy();
    }
  }

  async updateMovie(newMovie, movieId) {
    return await MovieModel.update(newMovie, {
      where: { id: movieId },
    });
  }
}

export const moviesService = new MovieService();
