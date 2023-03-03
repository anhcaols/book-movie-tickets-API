import { MovieModel } from '../models/movie.model.js';

export class MovieService {
  static async getMovieById(movieId) {
    return await MovieModel.findOne({
      where: {
        id: movieId,
      },
    });
  }

  static async createMovie(movie) {
    await MovieModel.create(movie);
  }

  static async deleteMovie(movieId) {
    const movie = await MovieModel.findOne({
      where: { id: movieId },
    });
    if (movie) {
      await movie.destroy();
    }
  }

  static async updateMovie(newMovie, movieId) {
    return await MovieModel.update(newMovie, {
      where: { id: movieId },
    });
  }
}
