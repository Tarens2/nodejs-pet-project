import { getRepository } from "typeorm";
import { User } from "../entity/User";

export default class StrategyController {

    static async githubStrategy(accessToken, refreshToken, profile, cb) {
        const userRepository = getRepository(User);
        let user: User = await userRepository.findOne({
            githubId: profile.id,
        });

        if (!user) {
            user = new User();
            user.githubId = profile.id;
            user.username = profile.username;
            if (profile.emails && profile.emails.length) {
                user.email = profile.emails[0].value;
            }
            await userRepository.save(user)
        }

        return cb(null, user);
    };

    static async localStrategy(username, password, done) {
        const userRepository = getRepository(User);
        try {
            let user: User = await userRepository.findOneOrFail({
                username,
            });

            if (!user || !user.checkIfUnencryptedPasswordIsValid(password)) {
                return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
            }
            return done(null, user);
        } catch (err) {
            if (err) {
                return done(err);
            }
        }
    };

    static async jwtStrategy (payload, done) {
        const userRepository = getRepository(User);
        try {
            let user: User = await userRepository.findOneOrFail({
                id: payload.userId,
            });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    };
}

