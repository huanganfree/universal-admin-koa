"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const menu_controller_1 = require("../../controller/system/menu.controller");
const menuRouter = new router_1.default({ prefix: '/api/system' });
// 创建菜单
menuRouter.post('/menu/create', menu_controller_1.createMenu);
menuRouter.put('/menu/edit', menu_controller_1.eidtMenu);
menuRouter.get('/menu/search', menu_controller_1.getAllMenus);
menuRouter.put('/menu/:id/status', menu_controller_1.enabledMenu);
menuRouter.delete('/menu/delete', menu_controller_1.deleteMenus);
exports.default = menuRouter;
