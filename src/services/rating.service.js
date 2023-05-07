import { AccountModel } from '../models/account.model.js';
import { RatingModel } from '../models/rating.model.js';

export class RatingService {
  async getRatingById(ratingId) {
    return await RatingModel.findOne({
      where: {
        id: ratingId,
      },
    });
  }

  async getRatings(offset, limit, movieId) {
    return await RatingModel.findAll({
      offset,
      limit,
      where: {
        movie_id: movieId,
      },
    });
  }

  async getRatesByMovie(movieId) {
    return await RatingModel.findAll({
      where: {
        movie_id: movieId,
      },
    });
  }

  async getRatingsCount(movieId) {
    return await RatingModel.count({
      where: {
        movie_id: movieId,
      },
    });
  }

  async createRating(rating) {
    await RatingModel.create(rating);
  }

  async existingRating(movieId, userId) {
    return await RatingModel.findOne({
      where: {
        movie_id: movieId,
        user_id: userId,
      },
    });
  }

  async deleteRating(ratingId) {
    const rating = await RatingModel.findOne({
      where: { id: ratingId },
    });
    if (rating) {
      await rating.destroy();
    }
  }

  async deleteRatingByMovie(movieId) {
    const ratings = await RatingModel.findAll({
      where: { movie_id: movieId },
    });
    ratings.map(async (rating) => {
      await rating.destroy();
    });
  }

  async updateRating(newRating, ratingId) {
    return await RatingModel.update(newRating, {
      where: { id: ratingId },
    });
  }
}

export const ratingsService = new RatingService();
