import * as Joi from 'joi';

export const SearchMeetupSchema = Joi.object({
  text: Joi.string().max(255).required(),
});
