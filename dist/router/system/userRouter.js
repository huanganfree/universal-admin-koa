"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const user_controller_1 = require("../../controller/system/user.controller");
const userRouter = new router_1.default({ prefix: '/api/system' });
// 用户列表
userRouter.get('/users/search', user_controller_1.getUsers);
userRouter.post('/user/create', user_controller_1.addUser);
userRouter.put('/user/:id/status', user_controller_1.updateUserStatus);
userRouter.put('/user/edit', user_controller_1.editUser);
userRouter.delete('/user/delete', user_controller_1.deleteUser);
exports.default = userRouter;
