import Joi from 'joi';

const reportByTagsValidation = Joi.object({
  tags: Joi.array().items(Joi.string()).required(),
});

export { reportByTagsValidation };
