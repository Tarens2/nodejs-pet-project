import { Router } from "express";
import AuthController from "../controllers/AuthController";
import * as jwt from "jsonwebtoken";
const passport = require("passport");

const router = Router();

router.get("/github", passport.authenticate("github", { session: false }));
// router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
