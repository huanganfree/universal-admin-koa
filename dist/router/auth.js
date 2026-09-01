"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controller/auth.controller");
const router_1 = __importDefault(require("@koa/router"));
const router = new router_1.default({ prefix: '/api/auth' });
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.post('/refresh', auth_controller_1.postAccessToken);
// 获取用户信息
router.get('/userInfo', auth_controller_1.userInfo);
router.get('/menus', auth_controller_1.getUserMenus);
exports.default = router;
