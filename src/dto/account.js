import Joi from 'joi';

export const LoginAccountSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export const RegisterAccountSchema = Joi.object({
  full_name: Joi.string().min(6).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  confirm_password: Joi.ref('password'),
  phone_number: Joi.string().allow(null),
  date_of_birth: Joi.string().allow(null),
  gender: Joi.string().allow(null),
  role: Joi.string().allow(null),
});
