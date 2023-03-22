import { MovieGenreModel } from '../models/movie-genre.model.js';

export class MovieGenreService {
  async getMovieGenreById(movieId) {
    return await MovieGenreModel.findAll({
      where: {
        movie_id: movieId,
      },
    });
  }

  async createMovieGenre(movieGenre) {
    await MovieGenreModel.create(movieGenre);
  }

  async deleteMovieGenre(movieId) {
    const movieGenres = await MovieGenreModel.findAll({
      where: { movie_id: movieId },
    });
    movieGenres.map(async (movieGenre) => {
      await movieGenre.destroy();
    });
  }

  async updateMovieGenre(newMovieGenre) {
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

export const movieGenreServiceService = new MovieGenreService();
