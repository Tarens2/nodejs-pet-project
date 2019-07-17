import { Strategy } from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';
import {APP_SECRET, GITHUB_KEY, GITHUB_SECRET} from "./config";
import {getRepository} from "typeorm";
import {User} from "./entity/User";
const passport = require('passport');

passport.use(new Strategy({
        clientID: GITHUB_KEY,
        clientSecret: GITHUB_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/github/callback'
    },
    async function(accessToken, refreshToken, profile, cb) {
        const userRepository = getRepository(User);
        const user: User = await userRepository.findOne({
            githubId: profile.id,
        });

        if (!user) {
            await userRepository.save({
                githubId: profile.id,
                username: profile.username,
                email: null
            })
        }

        return cb(null, profile);
    })
);

// passport.use(new LocalStrategy({
//     usernameField: 'user[email]',
//     passwordField: 'user[password]',
// }, async (email, password, done) => {
//     const userRepository = getRepository(User);
//     const user: User = await userRepository.findOne({ email })
//     if(!user || !user.validatePassword(password)) {
//         return done(null, false, { errors: { 'email or password': 'is invalid' } });
//     }
//
//     return done(null, user);
// }));

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
            res.redirect('/');
        }
    );
}