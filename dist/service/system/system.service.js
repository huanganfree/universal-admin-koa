"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceGetUserInfo = serviceGetUserInfo;
exports.serviceGetDictItem = serviceGetDictItem;
exports.serviceAddRole = serviceAddRole;
exports.serviceGetRoles = serviceGetRoles;
exports.serviceDeleteRoles = serviceDeleteRoles;
exports.serviceEditRoles = serviceEditRoles;
exports.serviceUpdateRoleStatus = serviceUpdateRoleStatus;
exports.serviceUpdateRoleAuth = serviceUpdateRoleAuth;
exports.serviceGetRoleAuth = serviceGetRoleAuth;
const db_1 = require("../../db");
const sequelize_1 = require("sequelize");
// 获取用户信息
async function serviceGetUserInfo(ctx) {
    const { userId } = ctx.state.user;
    const user = await db_1.User.findOne({ where: { id: userId } });
    return user?.toJSON();
}
// 获取字典
async function serviceGetDictItem(dictCode) {
    const res = await db_1.SysDictItem.findAll({ where: { dict_code: dictCode } });
    return res;
}
// 新增角色
async function serviceAddRole(ctx) {
    const { userId } = ctx.state.user;
    const { roleName, roleCode, description, status } = ctx.request.body;
    const roleIn = await db_1.Role.create({ roleName, roleCode, status, description, createdBy: userId, updatedBy: userId });
    return roleIn.toJSON();
}
// 获取角色列表
/**
 * offset:页码  limit：数量
 * @param ctx
 * @returns
 */
async function serviceGetRoles(ctx) {
    const { page = 1, pageSize = 10, roleName: roleNameQuery = '', status = '', ...leftParams } = ctx.request.query;
    const roleName = (typeof roleNameQuery === 'string' ? roleNameQuery : roleNameQuery[0] ?? '').trim();
    const statusCondition = status !== undefined && status !== '' ? { status } : {};
    const { count, rows } = await db_1.Role.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { roleName: { [sequelize_1.Op.like]: `%${roleName}%` }, ...statusCondition, ...leftParams },
        order: [['createdAt', 'DESC']],
        attributes: [
            [sequelize_1.Sequelize.literal("DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s')"), 'updatedAt'],
            [sequelize_1.Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s')"), 'createdAt'],
            'roleName',
            'roleCode',
            'description',
            'status',
            'id'
        ]
    });
    return {
        total: count,
        records: rows
    };
}
// 删除角色
async function serviceDeleteRoles(ids) {
    await db_1.Role.destroy({
        where: { id: { [sequelize_1.Op.or]: ids } },
    });
}
// 编辑角色
async function serviceEditRoles(params) {
    await db_1.Role.update({ ...params }, { where: { id: params.id } });
}
// 角色状态
async function serviceUpdateRoleStatus(id, { status }) {
    return await db_1.Role.update({ status }, { where: { id } });
}
// 角色权限(事务)
async function serviceUpdateRoleAuth(id, menuIds) {
    const t = await db_1.sequelize.transaction();
    try {
        const role = await db_1.Role.findByPk(id, { transaction: t });
        if (role) {
            await role.setMenuModels(menuIds, { transaction: t });
            await t.commit();
        }
    }
    catch (error) {
        await t.rollback(); // 把 DELETE 的数据回滚
        throw error;
    }
}
// 获取字典
async function serviceGetRoleAuth(id) {
    const res = await db_1.RoleMenuModel.findAll({ where: { roleId: id }, attributes: ['menuId'] });
    return res.map(item => item.menuId);
}
