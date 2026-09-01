"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceGetUsers = serviceGetUsers;
exports.serviceAddUser = serviceAddUser;
exports.serviceUpdateUserStatus = serviceUpdateUserStatus;
exports.serviceEditUsers = serviceEditUsers;
exports.serviceDeleteUsers = serviceDeleteUsers;
const db_1 = require("../../db");
const sequelize_1 = require("sequelize");
async function serviceGetUsers(ctx) {
    const { page = 1, pageSize = 10, username = '', status, ...leftParams } = ctx.request.query;
    const statusObj = status === undefined || status === null ? {} : { status: Number(status) };
    const { count, rows } = await db_1.User.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { username: { [sequelize_1.Op.like]: `%${username}%` }, ...statusObj, ...leftParams }, // 模糊查询
        order: [['createdAt', 'DESC']],
        include: [{
                model: db_1.Role,
                attributes: ['roleName', 'roleCode']
            }]
    });
    const transformRows = rows.map((el) => {
        const item = el.toJSON();
        if (item.Role) {
            item.roleName = item.Role.roleName;
            item.roleCode = item.Role.roleCode;
        }
        delete item.Role;
        return item;
    });
    return {
        total: count,
        records: transformRows
    };
}
// 新增角色
async function serviceAddUser(ctx) {
    const { userId } = ctx.state.user;
    const { username, nickname, roleId, phone } = ctx.request.body;
    const data = await db_1.User.create({ phone, username, nickname, roleId, createdBy: userId, updatedBy: userId });
    return data.toJSON();
}
// 状态
async function serviceUpdateUserStatus(id, { status }) {
    return await db_1.User.update({ status }, { where: { id } });
}
async function serviceEditUsers(params) {
    await db_1.User.update({ ...params }, { where: { id: params.id } });
}
async function serviceDeleteUsers(ids) {
    await db_1.User.destroy({
        where: { id: { [sequelize_1.Op.or]: ids } },
    });
}
