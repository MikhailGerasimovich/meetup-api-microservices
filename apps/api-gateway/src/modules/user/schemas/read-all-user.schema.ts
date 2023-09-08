import * as Joi from 'joi';
import { PaginationDto, SortingDto } from '@app/common';
import { ReadAllUserDto } from '../dto';

export const ReadAllUserSchema = Joi.object<ReadAllUserDto>({
  username: Joi.string().optional(),
  email: Joi.string().optional(),

  pagination: Joi.object<PaginationDto>({
    page: Joi.number().min(1).optional(),
    size: Joi.number().min(1).max(100).optional(),
  }).optional(),
  sorting: Joi.object<SortingDto>({
    column: Joi.string().optional(),
    direction: Joi.string().valid('desc', 'asc').optional(),
  }).optional(),
}).options({ abortEarly: false });
