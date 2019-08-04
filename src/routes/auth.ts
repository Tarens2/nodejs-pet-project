import { Router } from "express";
import AuthController from "../controllers/AuthController";
import * as jwt from "jsonwebtoken";
const passport = require('passport');

const router = Router();

// router.post("/login", passport.authenticate('local'), AuthController.login);
router.get("/profile", passport.authenticate('jwt'), AuthController.profile);
router.get('/github', passport.authenticate('github', { session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false }), AuthController.githubLogin);
// router.post("/register", AuthController.register);
// router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;