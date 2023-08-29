import * as Joi from 'joi';

export const CreateMeetupSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().max(255).required(),
  date: Joi.string().required(),
  place: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).min(1).required(),
});
