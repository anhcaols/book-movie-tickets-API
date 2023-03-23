import Joi from 'joi';

export const ScheduleSchema = Joi.object({
  movie_id: Joi.number().required(),
  room_id: Joi.number().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
});

export const GetAllSchedulesSchema = Joi.object({
  movie_id: Joi.number().required(),
  room_id: Joi.number().required(),
});
