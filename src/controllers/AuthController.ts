import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import { User } from "../entity/User";
import { getRepository } from "typeorm";
import {
  JsonController,
  Post,
  Req,
  Res,
  UseBefore,
  Get
} from "routing-controllers";
import { IGetUserAuthInfoRequest } from "../types/IGetUserAuthInfoReques";
import { body, validationResult } from "express-validator";

const passport = require("passport");

@JsonController("/auth")
class AuthController {

  @Get("/me")
  @UseBefore(passport.authenticate("jwt"))
  getMe(@Req() req: IGetUserAuthInfoRequest) {
    return req.user;
  }

  @Post("/login")
  @UseBefore(passport.authenticate("local"))
  login(@Req() request: IGetUserAuthInfoRequest, @Res() response: Response) {
    if (request.user) {
      const token = jwt.sign(
        { userId: request.user.id, username: request.user.username },
        config.JWT_SECRET,
        { expiresIn: "1m" }
      );

      response.send({ token, user: request.user });
    }
  }

  @Get("/github")
  @UseBefore(passport.authenticate("github", { session: false }))
  github() {}

  @Get("/github/callback")
  @UseBefore(passport.authenticate("github", { session: false }))
  githubLogin(@Req() req: IGetUserAuthInfoRequest, @Res() res: Response) {
    const token = jwt.sign(
        { userId: req.user.id, username: req.user.username },
        config.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.send({ token, user: req.user });
  }

  @Post("/register")
  @UseBefore(
    body("username")
      .exists({ checkFalsy: true })
      .custom(async value => {
        const userRepository = getRepository(User);
        const user: User = await userRepository.findOne({
          where: { username: value }
        });
        if (user) {
          throw new Error("E-mail already in use");
        }
        return true;
      }),

    body("password").exists({ checkFalsy: true }),

    body("passwordConfirmation")
      .exists({ checkFalsy: true })
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }

        return true;
      })
  )
  async register(@Req() req: Request, @Res() res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let { username, password } = req.body;

    const userRepository = getRepository(User);

    const createUser: User = new User();
    createUser.username = username;
    createUser.password = password;
    try {
      await userRepository.save(createUser);

      const token = jwt.sign(
        { userId: createUser.id, username: createUser.username },
        config.JWT_SECRET,
        { expiresIn: "1m" }
      );

      return res.json({ token, user: createUser });
    } catch (e) {
      return res.sendStatus(500);
    }
  }

  // static changePassword = async (req: Request, res: Response) => {
  //     //Get ID from JWT
  //     const id = res.locals.jwtPayload.userId;
  //
  //     //Get parameters from the body
  //     const { oldPassword, newPassword } = req.body;
  //     if (!(oldPassword && newPassword)) {
  //         res.status(400).send();
  //     }
  //
  //     //Get user from the database
  //     const userRepository = getRepository(User);
  //     let user: User;
  //     try {
  //         user = await userRepository.findOneOrFail(id);
  //     } catch (id) {
  //         res.status(401).send();
  //     }
  //
  //     //Check if old password matchs
  //     if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
  //         res.status(401).send();
  //         return;
  //     }
  //
  //     //Validate de model (password lenght)
  //     user.password = newPassword;
  //     const errors = await validate(user);
  //     if (errors.length > 0) {
  //         res.status(400).send(errors);
  //         return;
  //     }
  //     //Hash the new password and save
  //     user.hashPassword();
  //     userRepository.save(user);
  //
  //     res.status(204).send();
  // };
}
export default AuthController;
