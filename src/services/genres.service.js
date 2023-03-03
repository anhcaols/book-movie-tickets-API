import { GenresModel } from '../models/genres.model.js';

export class GenresService {
  static async getGenreById(genreId) {
    return await GenresModel.findOne({
      where: {
        id: genreId,
      },
    });
  }

  static async createGenre(genre) {
    await GenresModel.create(genre);
  }

  static async deleteGenre(genreId) {
    const genre = await GenresModel.findOne({
      where: { id: genreId },
    });
    if (genre) {
      await genre.destroy();
    }
  }

  static async updateGenre(newGenre, genreId) {
    return await GenresModel.update(newGenre, {
      where: { id: genreId },
    });
  }
}
