import Joi from 'joi';

export const CinemaSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
});
