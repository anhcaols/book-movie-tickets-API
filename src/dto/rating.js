import Joi from 'joi';

export const RatingSchema = Joi.object({
  user_id: Joi.number().required(),
  movie_id: Joi.number().required(),
  rate: Joi.number().required(),
  content: Joi.string(),
});
