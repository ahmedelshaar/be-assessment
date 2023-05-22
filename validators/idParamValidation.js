import Joi from 'joi';

const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24),
});

export default idParamSchema;
