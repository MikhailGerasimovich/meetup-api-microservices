import * as Joi from 'joi';
import { CreateUserDto } from '../../../../../authorization-microservice/src/user/dto/create-user.dto';

export const CreateUserSchema = Joi.object<CreateUserDto>({
  login: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
}).options({ abortEarly: false });
