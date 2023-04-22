import Joi from 'joi';

export const SeatTypeSchema = Joi.object({
  // type: Joi.string().required(),
  price: Joi.number().required(),
});
