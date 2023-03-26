import Joi from 'joi';

export const FoodSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  image: Joi.string(),
});
