import { Strategy } from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';
import config, {APP_SECRET, GITHUB_KEY, GITHUB_SECRET} from "./config";
import {getRepository} from "typeorm";
import {User} from "./entity/User";
import * as jwt from "jsonwebtoken";
const passport = require('passport');

passport.use(new Strategy({
        clientID: GITHUB_KEY,
        clientSecret: GITHUB_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/github/callback'
    },
    async function(accessToken, refreshToken, profile, cb) {
        const userRepository = getRepository(User);
        let user: User = await userRepository.findOne({
            githubId: profile.id,
        });

        if (!user) {
            user = new User();
            user.githubId = profile.id;
            user.username = profile.username;

            await userRepository.save(user)
        }

        return cb(null, user);
    })
);

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

export default function withAuth(app) {
    app.use(require('express-session')({ secret: APP_SECRET, resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/api/auth/github', passport.authenticate('github'));

    app.get('/api/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/sign-in' }),
        function(req, res) {
            const token = jwt.sign(
                { userId: req.user.id, username: req.user.username },
                config.jwtSecret,
                { expiresIn: "1h" }
            );

            res.redirect('/');
        }
    );
}