import {getRepository} from "typeorm";
import {Response} from "express";
import {User} from "../entity/User";
import {JsonController, Param, Body, Get, Post, Put, Delete, UseBefore, Req, Res} from "routing-controllers";
import {IGetUserAuthInfoRequest} from "../types/IGetUserAuthInfoReques";

const passport = require('passport');

@JsonController('/users')
export default class UsersController {
    userRepository = getRepository(User);

    @Get("")
    getAll() {
        return this.userRepository.find();
    }

    @Get("/me")
    @UseBefore(passport.authenticate('jwt'))
    getMe(@Req() request: IGetUserAuthInfoRequest, @Res() response: Response) {
        return this.userRepository.find({ where: { username: request.user.username }});
    }

    @Get("/:id")
    getOne(@Param("id") id: number) {
        return this.userRepository.findOne(id);
    }

    @Post("")
    post(@Body() user: User) {
        return this.userRepository.insert(user);
    }

    @Put("/:id")
    put(@Param("id") id: number, @Body() user: User) {
        return this.userRepository.update(id, user);
    }

    @Delete("/:id")
    remove(@Param("id") id: number) {
        return this.userRepository.remove(({ id } as User));
    }
}
