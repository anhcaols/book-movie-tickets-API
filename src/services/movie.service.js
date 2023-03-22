import { GenresModel } from '../models/genre.model.js';
import { MovieGenreModel } from '../models/movie-genre.model.js';
import { MovieModel } from '../models/movie.model.js';

export class MovieService {
  async getMovies(offset, limit, type) {
    let condition = {};
    if (type == 'nowShowing') {
      condition = {
        status: 1,
      };
    }
    if (type == 'comingSoon') {
      condition = {
        status: 0,
      };
    }
    return await MovieModel.findAll({
      offset,
      limit,
      where: condition,
      include: {
        model: GenresModel,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });
  }

  async getMoviesCount(type) {
    let condition = {};
    if (type == 'nowShowing') {
      condition = {
        status: 1,
      };
    }
    if (type == 'comingSoon') {
      condition = {
        status: 0,
      };
    }
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
    return await MovieModel.findAll({
      where: {
        slug: slug,
      },
      include: {
        model: GenresModel,
        attributes: ['name'],
        through: { attributes: [] },
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
