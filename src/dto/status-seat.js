import Joi from 'joi';

export const StatusSeatSchema = Joi.object({
  room_id: Joi.number().required(),
});

export const UpdateStatusSeatSchema = Joi.object({
  seat_id: Joi.number().required(),
  schedule_id: Joi.number().required(),
  status: Joi.string().required(),
});

export const GetAllStatusSeatSchema = Joi.object({
  schedule_id: Joi.number(),
});
