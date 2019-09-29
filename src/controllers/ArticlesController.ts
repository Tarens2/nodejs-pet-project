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
import { Article } from '../entity/Article';
import { GetUserAuthInfoRequest } from '../types/IGetUserAuthInfoReques';
import { Image } from '../entity/Image';
import { upload } from '../lib/uploadImageOnS3';

const passport = require('passport');

@JsonController('/articles')
export default class PhotosController {
  articleRepository = getRepository(Article);

  @Get('')
  getAll() {
    return this.articleRepository.find();
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.articleRepository.findOne(id);
  }

  @Post('/:id/images')
  @UseBefore(upload.single('image'))
  postImages(@Req() req, @Param('id') id: number) {
    return getRepository(Image).save({
      article: {
        id,
      },
      url: req.file.location,
    });
  }

  @Post('')
  @UseBefore(passport.authenticate('jwt'))
  post(@Req() req: GetUserAuthInfoRequest, @Body() article: Article) {
    return this.articleRepository.insert({ user: req.user, ...article });
  }

  @Put('/:id')
  put(@Param('id') id: number, @Body() article: Article) {
    return this.articleRepository.update(id, article);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.articleRepository.remove({ id } as Article);
  }
}
