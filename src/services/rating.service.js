import { RatingModel } from '../models/rating.model.js';

export class RatingService {
  static async getRatingById(ratingId) {
    return await RatingModel.findOne({
      where: {
        id: ratingId,
      },
    });
  }

  static async createRating(rating) {
    await RatingModel.create(rating);
  }

  static async deleteRating(ratingId) {
    const rating = await RatingModel.findOne({
      where: { id: ratingId },
    });
    if (rating) {
      await rating.destroy();
    }
  }

  static async updateRating(newRating, ratingId) {
    return await RatingModel.update(newRating, {
      where: { id: ratingId },
    });
  }
}
