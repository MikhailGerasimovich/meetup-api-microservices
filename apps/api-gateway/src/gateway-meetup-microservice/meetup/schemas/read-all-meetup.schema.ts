import * as Joi from 'joi';
import { PaginationDto, SortingDto } from '@app/common';
import { ReadAllMeetupDto } from '../dto/read-all-meetup.dto';

export const ReadAllMeetupSchema = Joi.object<ReadAllMeetupDto>({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  date: Joi.string().optional(),
  place: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  organizerId: Joi.number().optional(),

  pagination: Joi.object<PaginationDto>({
    page: Joi.number().min(1).optional(),
    size: Joi.number().min(1).max(100).optional(),
  }).optional(),
  sorting: Joi.object<SortingDto>({
    column: Joi.string().optional(),
    direction: Joi.string().valid('desc', 'asc').optional(),
  }).optional(),
}).options({ abortEarly: false });
