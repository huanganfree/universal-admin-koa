"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceLogin = serviceLogin;
exports.serviceUserInfo = serviceUserInfo;
exports.serviceUserMenus = serviceUserMenus;
const db_1 = require("../db");
async function serviceLogin(params) {
    const { phone } = params;
    const user = await db_1.User.findOne({ where: { phone }, include: { model: db_1.Role, attributes: ['roleName'] } });
    return user;
}
async function serviceUserInfo(userId) {
    const user = await db_1.User.findOne({ where: { id: userId }, include: { model: db_1.Role, attributes: ['roleName'] } });
    return user;
}
// 根据角色查菜单权限
async function serviceUserMenus(roleId) {
    const menusData = await db_1.Role.findByPk(roleId, { include: { model: db_1.MenuModel, as: 'menuModels', through: { attributes: [] }, where: { status: 1 } } });
    return menusData?.menuModels ?? [];
}
