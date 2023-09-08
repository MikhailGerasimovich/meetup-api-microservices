import { YandexUser } from '@app/common';
import * as Joi from 'joi';

export const YandexLoginSchema = Joi.object<YandexUser>({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
}).options({ abortEarly: false });
