import { RatingModel } from '../models/rating.model.js';

export class RatingService {
  static async getRatingById(ratingId) {
    return await RatingModel.findOne({
      where: {
        id: ratingId,
      },
    });
  }

  static async getRatings(offset, limit, movieId) {
    return await RatingModel.findAll({
      offset,
      limit,
      where: {
        movie_id: movieId,
      },
    });
  }

  static async getRatingsCount(movieId) {
    return await RatingModel.count({
      where: {
        movie_id: movieId,
      },
    });
  }

  static async createRating(rating) {
    await RatingModel.create(rating);
  }

  static async existingRating(movieId, userId) {
    await RatingModel.findOne({
      where: {
        movie_id: movieId,
        user_id: userId,
      },
    });
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
