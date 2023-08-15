import Joi from 'joi';

export const CreateTagSchema = Joi.object({
  title: Joi.string().optional(),
}).options({ abortEarly: false });
