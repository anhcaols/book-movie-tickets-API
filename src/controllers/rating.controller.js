import { RatingSchema } from '../dto/rating.js';
import { AccountService } from '../services/account.service.js';
import { MovieService } from '../services/movie.service.js';
import { RatingService } from '../services/rating.service.js';

export const createRatingController = async (req, res, next) => {
  try {
    const { error, value } = RatingSchema.validate(req.body);

    const existingRating = await RatingService.existingRating(value.movie_id, value.user_id);
    if (existingRating) {
      return res.status(404).json({
        message: 'Existing Rating',
        status: 404,
        success: false,
      });
    }

    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    await RatingService.createRating(value);
    res.json({ message: 'Create rating successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const getRatingsController = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const totalDocs = await RatingService.getRatingsCount(movieId);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const movie = await MovieService.getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }

    const ratings = await RatingService.getRatings(offset, limit, movieId);
    const data = await Promise.all(
      ratings.map(async (rating) => {
        const ownerReviewer = await AccountService.getAccountById(rating.dataValues.user_id);
        return {
          id: rating.dataValues.id,
          rate: rating.dataValues.rate,
          movieId: rating.dataValues.movie_id,
          user: {
            id: ownerReviewer.dataValues.id,
            fullName: ownerReviewer.dataValues.full_name,
            avatar: ownerReviewer.dataValues.avatar,
            email: ownerReviewer.dataValues.email,
            role: ownerReviewer.dataValues.role,
          },
          createdAt: rating.dataValues.createdAt,
          updatedAt: rating.dataValues.updatedAt,
        };
      })
    );

    res.json({
      message: 'Get ratings successfully',
      ratings: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page,
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};
