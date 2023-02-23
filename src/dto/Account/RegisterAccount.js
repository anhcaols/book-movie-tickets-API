import Joi from "joi";


export const RegisterAccountSchema = Joi.object({
  fullName: Joi.string().min(6).max(30).required(),
  username: Joi.string().min(6).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  repeat_password: Joi.ref("password"),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
  address: Joi.string().required(),
  sex: Joi.string().required().valid("male", "female"),
  roles: Joi.array().required().items(Joi.string().valid("admin", "user"))
});