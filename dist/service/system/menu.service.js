"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceCreateMenu = serviceCreateMenu;
exports.serviceEditMenu = serviceEditMenu;
exports.serviceUpdateMenuStatus = serviceUpdateMenuStatus;
exports.serviceDeleteMenus = serviceDeleteMenus;
exports.serviceGetAllMenus = serviceGetAllMenus;
const sequelize_1 = require("sequelize");
const db_1 = require("../../db");
async function serviceCreateMenu(body) {
    const { name, type, ...leftProps } = body;
    await db_1.MenuModel.create({ name, type, ...leftProps });
}
async function serviceEditMenu(body) {
    const { id, name, type, ...leftProps } = body;
    await db_1.MenuModel.update({ name, type, ...leftProps }, { where: { id } });
}
// 更新启用，禁用状态
async function serviceUpdateMenuStatus({ id, status }) {
    await db_1.MenuModel.update({ status }, { where: { id } });
}
async function serviceDeleteMenus(ids) {
    await db_1.MenuModel.destroy({
        where: { id: { [sequelize_1.Op.or]: ids } },
    });
}
async function serviceGetAllMenus(body) {
    const { name = '', ...leftProps } = body;
    const data = await db_1.MenuModel.findAll({
        where: {
            name: {
                [sequelize_1.Op.like]: `%${name}%`,
            },
            ...leftProps
        },
        order: [['parentId', 'ASC'], ['sort', 'ASC']],
    });
    return data;
}
