import Joi from 'joi';

export const SeatSeatSchema = Joi.object({
  room_id: Joi.number().required(),
  row_vip: Joi.any(),
});
