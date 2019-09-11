import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { GITHUB_CONFIG, JWT_SECRET, LOCAL_CONFIG } from "./config";
import StrategyController from "./controllers/StrategyController";
const passport = require("passport");

export default function initStrategies() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: JWT_SECRET
  };

  passport.use(new JwtStrategy(jwtOptions, StrategyController.jwtStrategy));
  passport.use(
    new GithubStrategy(GITHUB_CONFIG, StrategyController.githubStrategy)
  );
  passport.use(
    new LocalStrategy(LOCAL_CONFIG, StrategyController.localStrategy)
  );

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));
}
