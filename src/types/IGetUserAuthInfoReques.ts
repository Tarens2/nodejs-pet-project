import { Request } from 'express';
import { User } from '../entity/User';

export interface GetUserAuthInfoRequest extends Request {
  user: User;
}
