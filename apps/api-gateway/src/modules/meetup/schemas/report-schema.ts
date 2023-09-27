import * as Joi from 'joi';

export const ReportSchema = Joi.object({
  type: Joi.string().valid('pdf', 'csv').required(),
});
