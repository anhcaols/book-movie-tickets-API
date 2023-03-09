import { CinemaModel } from '../models/cinema.model.js';

export class CinemaService {
  static async getCinemaById(cinemaId) {
    return await CinemaModel.findOne({
      where: {
        id: cinemaId,
      },
    });
  }

  static async createCinema(cinema) {
    await CinemaModel.create(cinema);
  }

  static async deleteCinema(cinemaId) {
    const cinema = await CinemaModel.findOne({
      where: { id: cinemaId },
    });
    if (cinema) {
      await cinema.destroy();
    }
  }

  static async updateCinema(newCinema, cinemaId) {
    return await CinemaModel.update(newCinema, {
      where: { id: cinemaId },
    });
  }
}
