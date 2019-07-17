import {UserController} from "../controllers/UserController";

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}];


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