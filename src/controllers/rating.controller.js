import { RatingSchema } from '../dto/rating.js';
import { accountsService } from '../services/account.service.js';
import { moviesService } from '../services/movie.service.js';
import { ratingsService } from '../services/rating.service.js';

export const createRatingController = async (req, res, next) => {
  try {
    const { error, value } = RatingSchema.validate(req.body);

    const existingRating = await ratingsService.existingRating(value.movie_id, value.user_id);
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

    const rating = await ratingsService.createRating(value);
    const ownerReviewer = await accountsService.getAccountById(rating.dataValues.user_id);
    res.json({
      message: 'Create rating successfully',
      rating: { ...rating.dataValues, user: ownerReviewer },
      success: true,
    });
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
    const totalDocs = await ratingsService.getRatingsCount(movieId);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const movie = await moviesService.getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }

    const ratings = await ratingsService.getRatings(offset, limit, movieId);
    const data = await Promise.all(
      ratings.map(async (rating) => {
        const ownerReviewer = await accountsService.getAccountById(rating.dataValues.user_id);
        return {
          ...rating.dataValues,
          user: {
            id: ownerReviewer.dataValues.id,
            fullName: ownerReviewer.dataValues.full_name,
            avatar: ownerReviewer.dataValues.avatar,
            email: ownerReviewer.dataValues.email,
            role: ownerReviewer.dataValues.role,
          },
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
