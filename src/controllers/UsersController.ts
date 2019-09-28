import { getRepository } from 'typeorm';
import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  UseBefore,
  Req,
} from 'routing-controllers';
import { User } from '../entity/User';
import { GetUserAuthInfoRequest } from '../types/IGetUserAuthInfoReques';
import { Article } from '../entity/Article';

const passport = require('passport');

@JsonController('/users')
export default class UsersController {
  userRepository = getRepository(User);

  @Get('')
  getAll() {
    return this.userRepository.find();
  }

  @Get('/me')
  @UseBefore(passport.authenticate('jwt'))
  getMe(@Req() req: GetUserAuthInfoRequest) {
    return req.user;
  }

  @Get('/me/articles')
  @UseBefore(passport.authenticate('jwt'))
  getMyArticles(@Req() req: GetUserAuthInfoRequest) {
    return getRepository(Article).find({ user: req.user });
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.userRepository.findOne(id);
  }

  @Post('')
  post(@Body() user: User) {
    return this.userRepository.insert(user);
  }

  @Put('/:id')
  put(@Param('id') id: number, @Body() user: User) {
    return this.userRepository.update(id, user);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.userRepository.remove({ id } as User);
  }
}
