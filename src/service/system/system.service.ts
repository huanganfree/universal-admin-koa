/**
 * 处理业务逻辑，调用数据库
 */
import { Context } from "koa";
import { Role, User, SysDictItem, sequelize, RoleMenuModel } from "../../db";
import { EditRole, RoleBody } from "../../controller/system/system.controller";
import { Op, Sequelize } from "sequelize";

// 获取用户信息
export async function serviceGetUserInfo(ctx: Context) {
    const { userId } = ctx.state.user
    const user = await User.findOne({ where: { id: userId } })
    return user?.toJSON()
}

// 获取字典
export async function serviceGetDictItem(dictCode: string) {
    const res = await SysDictItem.findAll({ where: { dict_code: dictCode } })
    return res
}

// 新增角色
export async function serviceAddRole(ctx: Context) {
    const { userId } = ctx.state.user
    const { roleName, roleCode, description, status } = ctx.request.body as RoleBody
    const roleIn = await Role.create({ roleName, roleCode, status, description, createdBy: userId, updatedBy: userId });
    return roleIn.toJSON() as RoleBody
}

// 获取角色列表
/**
 * offset:页码  limit：数量
 * @param ctx 
 * @returns 
 */
export async function serviceGetRoles(ctx: Context) {
    const { page = 1, pageSize = 10, roleName: roleNameQuery = '', status = '' , ...leftParams } = ctx.request.query
    const roleName = (typeof roleNameQuery === 'string' ? roleNameQuery : roleNameQuery[0] ?? '').trim();
    const statusCondition = status !== undefined && status !== '' ? { status } : {}
    const { count, rows } = await Role.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { roleName: { [Op.like]: `%${roleName}%` }, ...statusCondition, ...leftParams },
        order: [['createdAt', 'DESC']],
        attributes: [
            [Sequelize.literal("DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s')"), 'updatedAt'],
            [Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s')"), 'createdAt'],
            'roleName',
            'roleCode',
            'description',
            'status',
            'id'
        ]
    })
    return {
        total: count,
        records: rows
    }
}

// 删除角色
export async function serviceDeleteRoles(ids: any[]) {
    await Role.destroy({
        where: { id: { [Op.or]: ids } },
    })
}

// 编辑角色
export async function serviceEditRoles(params: EditRole) {
    await Role.update({ ...params }, { where: { id: params.id } })
}

// 角色状态
export async function serviceUpdateRoleStatus(id: number, {status}: {status: any}) {
    return await Role.update({ status }, { where: { id } })
}

// 角色权限
export async function serviceUpdateRoleAuth(id: any, menuIds: any[]) {
    const t = await sequelize.transaction()
    try {
        const role = await Role.findByPk(id, { transaction: t });
        if(role){
            await (role as any).setMenuModels(menuIds, { transaction: t }); 
            await t.commit();
        }
    } catch (error) {
        await t.rollback(); // 报错了就把 DELETE 的数据吃回来
        throw error
    }
}

// 获取字典
export async function serviceGetRoleAuth(id: string) {
    const res = await RoleMenuModel.findAll({ where: { roleId: id }, attributes: ['menuId'] })
    return res.map(item => item.menuId)
}