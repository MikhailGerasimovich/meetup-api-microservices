import * as Joi from 'joi';
import { CreateTagDto } from '../dto/create-tag.dto';

export const CreateTagSchema = Joi.object<CreateTagDto>({
  title: Joi.string().required(),
}).options({ abortEarly: false });
