import { Router } from "express";
import UsersController  from "../controllers/UsersController";
const passport = require('passport');


const router = Router();
router.get("/me", passport.authenticate('jwt'), UsersController.me);


export default router;

// register express routes from defined application routes
// Routes.forEach(route => {
//     (app as any)[route.method]('/api' + route.route, (req: Request, res: Response, next: Function) => {
//         const result = (new (route.controller as any))[route.action](req, res, next);
//         if (result instanceof Promise) {
//             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
//
//         } else if (result !== null && result !== undefined) {
//             res.json(result);
//         }
//     });
// });