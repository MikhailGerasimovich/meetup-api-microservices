import * as Joi from 'joi';

export const UpdateMeetupSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().max(255).optional(),
  date: Joi.string().optional(),
  place: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).min(1).optional(),
});
