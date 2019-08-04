import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import {User} from "../entity/User";
import {getRepository} from "typeorm";
import {JsonController, Post, Req, Res, UseBefore} from "routing-controllers";
import {IGetUserAuthInfoRequest} from "../types/IGetUserAuthInfoReques";
const passport = require('passport');

@JsonController('/auth')
class AuthController {

    @Post("/login")
    @UseBefore(passport.authenticate('local'))
    login(@Req() request: IGetUserAuthInfoRequest, @Res() response: Response) {
        if (request.user) {
            const token = jwt.sign(
                { userId: request.user.id, username: request.user.username },
                config.JWT_SECRET,
                { expiresIn: "1h" }
            );

            response.send({ token, user: request.user });
        }
    };

    static githubLogin = (req, res) => {
        const token = jwt.sign(
            { userId: req.user.id, username: req.user.username },
            config.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.send({ token, user: req.user });
    };

    static profile = async (req, res: Response) => {
        res.send(req.user);
    };


    static register = async (req: Request, res: Response, next: NextFunction) => {
        let { username, password, passwordConfirmation } = req.body;
        if (!(username && password && passwordConfirmation)) {
            res.sendStatus(400);
        } else {
            const userRepository = getRepository(User);
            const user: User = await userRepository.findOne({ where: { username } });

            if (user || password !== passwordConfirmation) {
                res.sendStatus(401);
            } else {
                const createUser : User = new User();

                createUser.username = username;
                createUser.password = password;
                try {
                    await userRepository.save(createUser);

                    const token = jwt.sign(
                        { userId: createUser.id, username: createUser.username },
                        config.JWT_SECRET,
                        { expiresIn: "1h" }
                    );

                    res.json({ token, user: createUser });
                } catch (e) {
                    next(e);
                    res.sendStatus(500);
                }
            }
        }
    };

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