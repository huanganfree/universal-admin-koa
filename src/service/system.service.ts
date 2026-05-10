/**
 * 处理业务逻辑，调用数据库
 */
import { Context } from "koa";
import { Role, User } from "../db";
import { RoleBody } from "../controller/system.controller";

// 获取用户信息
export async function serviceGetUserInfo(ctx: Context) {
    const { userId } = ctx.state.user
    const user = await User.findOne({ where: { id: userId } })
    return user?.toJSON()
}

// 新增角色
export async function serviceAddRole(ctx: Context) {
    const { userId } = ctx.state.user
    const { roleName, roleCode, description,status } = ctx.request.body as RoleBody
    const roleIn = await Role.create({ roleName, roleCode,status, description, createdBy: userId, updatedBy: userId });
    console.log('roleIn.toJSON()=', roleIn.toJSON());
    return roleIn.toJSON() as RoleBody
    
}

// 获取角色列表