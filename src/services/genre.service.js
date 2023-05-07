import { GenresModel } from '../models/genre.model.js';

export class GenreService {
  async getGenreById(genreId) {
    return await GenresModel.findOne({
      where: {
        id: genreId,
      },
    });
  }

  async getGenres(offset, limit) {
    return await GenresModel.findAll({ offset, limit });
  }

  async getGenreCounts() {
    return await GenresModel.count();
  }

  async createGenre(genre) {
    await GenresModel.create(genre);
  }

  async deleteGenre(genreId) {
    const genre = await GenresModel.findOne({
      where: { id: genreId },
    });
    if (genre) {
      await genre.destroy();
    }
  }

  async updateGenre(newGenre, genreId) {
    return await GenresModel.update(newGenre, {
      where: { id: genreId },
    });
  }
}

export const genresService = new GenreService();
