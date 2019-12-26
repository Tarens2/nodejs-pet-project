import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import {
  JsonController,
  Post,
  Req,
  Res,
  UseBefore,
  Get,
} from 'routing-controllers';
import { body, validationResult } from 'express-validator';
import { User } from '../entity/User';
import { GetUserAuthInfoRequest } from '../types/IGetUserAuthInfoReques';

const passport = require('passport');

@JsonController('/auth')
class AuthController {
  @Post('/login')
  @UseBefore(passport.authenticate('local'))
  login(@Req() request: GetUserAuthInfoRequest, @Res() response: Response) {
    if (request.user) {
      const token = jwt.sign(
        { userId: request.user.id, username: request.user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
      );

      response.send({ token, user: request.user });
    }
  }

  @Get('/github')
  @UseBefore(passport.authenticate('github', { session: false }))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  github() {}

  @Get('/github/callback')
  @UseBefore(passport.authenticate('github', { session: false }))
  githubLogin(@Req() req: GetUserAuthInfoRequest, @Res() res: Response) {
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return { token, user: req.user };
  }

  @Post('/register')
  @UseBefore(
    body('username')
      .exists({ checkFalsy: true })
      .custom(async value => {
        const userRepository = getRepository(User);
        const user: User = await userRepository.findOne({
          where: { username: value },
        });
        if (user) {
          throw new Error('E-mail already in use');
        }
        return true;
      }),

    body('password').exists({ checkFalsy: true }),

    body('passwordConfirmation')
      .exists({ checkFalsy: true })
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }

        return true;
      }),
  )
  async register(@Req() req: Request, @Res() res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const userRepository = getRepository(User);

    const createUser: User = new User();
    createUser.username = username;
    createUser.password = password;
    try {
      await userRepository.save(createUser);

      const token = jwt.sign(
        { userId: createUser.id, username: createUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '1m' },
      );

      return res.json({ token, user: createUser });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
}
export default AuthController;
