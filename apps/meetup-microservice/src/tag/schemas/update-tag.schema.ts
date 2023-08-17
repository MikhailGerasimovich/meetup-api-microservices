import * as Joi from 'joi';
import { UpdateTagDto } from '../dto/update-tag.dto';

export const UpdateTagSchema = Joi.object<UpdateTagDto>({
  title: Joi.string().optional(),
}).options({ abortEarly: false });
