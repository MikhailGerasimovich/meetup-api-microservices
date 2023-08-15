import Joi from 'joi';

export const CreateTagSchema = Joi.object({
  title: Joi.string().required(),
}).options({ abortEarly: false });
