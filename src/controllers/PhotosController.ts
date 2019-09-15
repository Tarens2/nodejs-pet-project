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
  UseInterceptor,
  UploadedFile,
} from 'routing-controllers';
import { Photo } from '../entity/Photo';
import { GetUserAuthInfoRequest } from '../types/IGetUserAuthInfoReques';

const passport = require('passport');

@JsonController('/photos')
export default class PhotosController {
  photoRepository = getRepository(Photo);

  @Get('')
  getAll() {
    return this.photoRepository.find();
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.photoRepository.findOne(id);
  }

  @Post('')
  @UseBefore(passport.authenticate('jwt'))
  post(@Req() req: GetUserAuthInfoRequest, @Body() photo: Photo) {
    return this.photoRepository.insert({ user: req.user, ...photo });
  }

  @Put('/:id')
  put(@Param('id') id: number, @Body() photo: Photo) {
    return this.photoRepository.update(id, photo);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.photoRepository.remove({ id } as Photo);
  }
}
