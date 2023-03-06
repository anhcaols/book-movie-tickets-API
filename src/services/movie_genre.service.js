import { MovieGenreModel } from '../models/movie_genre.model.js';

export class MovieGenreService {
  static async getMovieGenreById(movieId) {
    return await MovieGenreModel.findAll({
      where: {
        movie_id: movieId,
      },
    });
  }

  static async createMovieGenre(movieGenre) {
    await MovieGenreModel.create(movieGenre);
  }

  static async deleteMovieGenre(movieId) {
    const movieGenres = await MovieGenreModel.findAll({
      where: { movie_id: movieId },
    });
    movieGenres.map(async (movieGenre) => {
      await movieGenre.destroy();
    });
  }

  static async updateMovieGenre(newMovieGenre) {
    console.log('newMovieGenre', newMovieGenre);
    const movieGenres = await MovieGenreModel.findAll({
      where: {
        movie_id: newMovieGenre.movie_id,
      },
    });
    movieGenres.map((movieGenre) => {
      //   console.log('movieGenre', movieGenre.dataValues);
      if (newMovieGenre.genre_id !== movieGenre.dataValues.genre_id) {
        // console.log(newMovieGenre.genre_id, movieGenre.dataValues.genre_id);
        // this.deleteMovieGenre(newMovieGenre.movie_id);
        // this.createMovieGenre(newMovieGenre);
      }
    });
  }
}
