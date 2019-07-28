import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export default class UsersController {

    static async me(request, response: Response) {
        return response.send({ user: request.user })
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        const userRepository = getRepository(User);
        return userRepository.find();
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const userRepository = getRepository(User);
        return userRepository.findOne(request.params.id);
    }

    static async save(request: Request, response: Response, next: NextFunction) {
        const userRepository = getRepository(User);
        return userRepository.save(request.body);
    }

    static async remove(request: Request, response: Response, next: NextFunction) {
        const userRepository = getRepository(User);
        let userToRemove = await userRepository.findOne(request.params.id);
        await userRepository.remove(userToRemove);
    }

}
