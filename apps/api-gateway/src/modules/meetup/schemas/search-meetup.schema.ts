import * as Joi from 'joi';
import { SearchMeetupDto } from '../dto';

export const SearchMeetupSchema = Joi.object<SearchMeetupDto>({
  text: Joi.string().max(255).required(),
});
