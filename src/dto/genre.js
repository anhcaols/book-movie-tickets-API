import Joi from 'joi';

export const GenreSchema = Joi.object({
  name: Joi.string().required(),
});
