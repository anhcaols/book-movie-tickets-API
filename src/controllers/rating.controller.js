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
