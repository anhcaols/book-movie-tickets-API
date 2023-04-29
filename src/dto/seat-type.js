import Joi from 'joi';

export const SeatTypeSchema = Joi.object({
  type: Joi.string().required(),
  price: Joi.number().required(),
});

export const UpdateSeatTypeSchema = Joi.object({
  price: Joi.number().required(),
});
