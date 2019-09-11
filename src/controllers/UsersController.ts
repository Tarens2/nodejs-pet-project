import { getRepository } from 'typeorm';
import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
} from 'routing-controllers';
import { User } from '../entity/User';

@JsonController('/users')
export default class UsersController {
  userRepository = getRepository(User);

  @Get('')
  getAll() {
    return this.userRepository.find();
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
