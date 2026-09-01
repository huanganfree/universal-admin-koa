"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const system_controller_1 = require("../../controller/system/system.controller");
const router = new router_1.default({ prefix: '/api/system' });
// 登录用户信息
router.get('/userInfo', system_controller_1.getUserInfo);
// 字典
router.get('/dictItems', system_controller_1.getDictItem);
// 角色CRUD
router.post('/role/create', system_controller_1.addRole);
router.get('/roles/search', system_controller_1.getRoles);
router.delete('/roles/delete', system_controller_1.deleteRoles);
router.put('/role/edit', system_controller_1.editRoles);
router.put('/role/:id/status', system_controller_1.updateRoleStatus);
// 角色权限
router.put('/role/:id/auth', system_controller_1.updateRoleAuth);
router.get('/role/auth', system_controller_1.getRoleAuth);
exports.default = router;
