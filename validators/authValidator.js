import Joi from 'joi';

const signupValidation = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).max(255).required(),
});

const loginValidation = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).max(255).required(),
});

const verifyValidation = Joi.object({
  email: Joi.string().min(6).required().email(),
  verificationCode: Joi.number().integer().required(),
});

export { signupValidation, loginValidation, verifyValidation };
