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
import MyError from '../types/MyError';

const passport = require('passport');

@JsonController('/articles')
export default class ArticlesController {
  articleRepository = getRepository(Article);

  @Get('')
  getAll() {
    return this.articleRepository.find();
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.articleRepository.findOne(id, { relations: ['images'] });
  }

  @Post('/:id/images')
  @UseBefore(passport.authenticate('jwt'))
  @UseBefore(upload.single('image'))
  async postImages(
    @Req() req: GetUserAuthInfoRequest,
    @Param('id') id: number,
  ) {
    const article = await getRepository(Article).findOne(
      { id },
      { relations: ['user'] },
    );

    if (article.user.id === req.user.id) {
      return getRepository(Image).save({
        article: {
          id,
        },
        url: req.file.location,
      });
    }
    throw new MyError(
      403,
      'NOT_AUTHORIZED',
      'You try edit not your own article',
    );
  }

  @Post('')
  @UseBefore(passport.authenticate('jwt'))
  post(@Req() req: GetUserAuthInfoRequest, @Body() article: Article) {
    return this.articleRepository.insert({ user: req.user, ...article });
  }

  @Put('/:id')
  @UseBefore(passport.authenticate('jwt'))
  put(@Param('id') id: number, @Body() article: Article) {
    return this.articleRepository.update(id, article);
  }

  @Delete('/:id')
  @UseBefore(passport.authenticate('jwt'))
  remove(@Param('id') id: number) {
    return this.articleRepository.remove({ id } as Article);
  }
}
