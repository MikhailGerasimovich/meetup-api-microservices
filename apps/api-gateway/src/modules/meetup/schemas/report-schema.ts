import * as Joi from 'joi';
import { Report } from '../types';

export const ReportSchema = Joi.object<Report>({
  type: Joi.string().valid('pdf', 'csv').required(),
});
