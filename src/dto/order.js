import Joi from 'joi';

export const OrderSchema = Joi.object({
  user_id: Joi.number().required(),
  seat_id: Joi.array().items(Joi.number()).required(),
  schedule_id: Joi.number().required(),
  food: Joi.array()
    .items(
      Joi.object({
        id: Joi.number(),
        quantity: Joi.number(),
      })
    )
    .default([]),
});
