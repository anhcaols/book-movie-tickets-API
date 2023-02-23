import Joi from "joi";

export const LoginAccountSchema = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required()

});