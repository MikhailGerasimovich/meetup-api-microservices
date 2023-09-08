import * as Joi from 'joi';
import { CreateUserDto } from '../dto';

export const LocalRegistrationSchema = Joi.object<CreateUserDto>({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
}).options({ abortEarly: false });
