import { CinemaModel } from '../models/cinema.model.js';

export class CinemaService {
  async getCinemaById(cinemaId) {
    return await CinemaModel.findOne({
      where: {
        id: cinemaId,
      },
    });
  }

  async createCinema(cinema) {
    await CinemaModel.create(cinema);
  }

  async deleteCinema(cinemaId) {
    const cinema = await CinemaModel.findOne({
      where: { id: cinemaId },
    });
    if (cinema) {
      await cinema.destroy();
    }
  }

  async updateCinema(newCinema, cinemaId) {
    return await CinemaModel.update(newCinema, {
      where: { id: cinemaId },
    });
  }
}

export const cinemasService = new CinemaService();
