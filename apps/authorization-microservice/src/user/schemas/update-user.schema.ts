import * as Joi from 'joi';
import { UpdateUserDto } from '../dto/update-user.dto';

export const UpdateUserSchema = Joi.object<UpdateUserDto>({
  login: Joi.string().optional(),
  email: Joi.string().email().optional(),
}).options({ abortEarly: false });
