import { RatingSchema } from '../dto/rating.js';
import { RatingService } from '../services/rating.service.js';

export const createRatingController = async (req, res, next) => {
  try {
    const { error, value } = RatingSchema.validate(req.body);
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
    const limit = parseInt(req.query.limit) || 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const totalDocs = await RatingService.getRatingsCount();
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const ratings = await RatingService.getRatings(offset, limit);
    res.json({
      message: 'Get ratings successfully',
      ratings,
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
