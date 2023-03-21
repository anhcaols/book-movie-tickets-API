import Joi from 'joi';

export const RoomSchema = Joi.object({
  name: Joi.string().required(),
  cinema_id: Joi.number().required(),
  row_number: Joi.number().required(),
  column_number: Joi.number().required(),
});
