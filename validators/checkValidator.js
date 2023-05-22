import Joi from 'joi';

const createCheckValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  url: Joi.string().required(),
  protocol: Joi.string().required().valid('HTTP', 'HTTPS', 'TCP'),
  path: Joi.string().optional(),
  port: Joi.number().positive().optional(),
  webhook: Joi.string().optional(),
  timeout: Joi.number().positive().optional(),
  interval: Joi.number().positive().optional(),
  threshold: Joi.number().positive().optional(),
  authentication: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).optional(),
  httpHeaders: Joi.object().pattern(/./, Joi.string().required()).optional(),
  assert: Joi.object({
    statusCode: Joi.number().positive().required(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  ignoreSSL: Joi.boolean().optional(),
});

const updateCheckValidation = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  url: Joi.string().optional(),
  protocol: Joi.string().optional().valid('HTTP', 'HTTPS', 'TCP'),
  path: Joi.string().optional(),
  port: Joi.number().positive().optional(),
  webhook: Joi.string().optional(),
  timeout: Joi.number().positive().optional(),
  interval: Joi.number().positive().optional(),
  threshold: Joi.number().positive().optional(),
  authentication: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).optional(),
  httpHeaders: Joi.object().pattern(/./, Joi.string().required()).optional(),
  assert: Joi.object({
    statusCode: Joi.number().positive().required(),
  }).optional(),
  tags: Joi.array().items(Joi.string()),
  ignoreSSL: Joi.boolean().optional(),
});

export { createCheckValidation, updateCheckValidation };
