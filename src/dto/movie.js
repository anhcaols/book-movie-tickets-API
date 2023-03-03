import Joi from 'joi';

export const MovieSchema = Joi.object({
  genre_id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.string().required(),
  release_date: Joi.date().required(),
  actor: Joi.string().required(),
  director: Joi.string().required(),
  language: Joi.string().required(),
  country: Joi.string().required(),
  producer: Joi.string().required(),
  status: Joi.string().required(),
  age: Joi.number().required(),
  image: Joi.string(),
  trailer: Joi.string(),
});
