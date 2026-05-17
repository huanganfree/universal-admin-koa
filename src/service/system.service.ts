/**
 * 处理业务逻辑，调用数据库
 */
import { Context } from "koa";
import { Role, User, SysDictItem } from "../db";
import { EditRole, RoleBody } from "../controller/system.controller";
import { Op } from "sequelize";

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
    const { page = 1, pageSize = 10, roleName = '' } = ctx.request.query
    const { count, rows } = await Role.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: roleName ? { roleName: { [Op.like]: `%${roleName}%` } } : {}, // 模糊查询
        order: [['createdAt', 'DESC']]
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