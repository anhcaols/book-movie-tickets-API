import Joi from 'joi';

export const CreateGenreSchema = Joi.object({
  name: Joi.string().required(),
});

export const DeleteGenreSchema = Joi.object({
  id: Joi.number().required(),
});

export const updateGenreSchema = Joi.object({
  name: Joi.string().required(),
});
