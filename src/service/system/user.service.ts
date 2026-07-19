/**
 * 处理业务逻辑，调用数据库
 */
import { Context } from "koa";
import { Role, User } from "../../db";
import { Op } from "sequelize";
import { EditUser, UserBody } from "../../controller/system/user.controller";

export async function serviceGetUsers(ctx: Context) {
    const { page = 1, pageSize = 10, username = '', status, ...leftParams } = ctx.request.query
    const statusObj = status === undefined || status === null ? {} : {status: Number(status)}
    const { count, rows } = await User.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { username: { [Op.like]: `%${username}%` }, ...statusObj,  ...leftParams }, // 模糊查询
        order: [['createdAt', 'DESC']],
        include: [{ // 这里就是连表查询
            model: Role,
            attributes: ['roleName', 'roleCode']
        }]
    })

    const transformRows = rows.map((el: any) => {
        const item = el.toJSON()
        if(item.Role){
            item.roleName = item.Role.roleName;
            item.roleCode = item.Role.roleCode;
        }
        delete item.Role
        return item
    })
    
    return {
        total: count,
        records: transformRows
    }
}

// 新增角色
export async function serviceAddUser(ctx: Context) {
    const { userId } = ctx.state.user
    const { username, nickname, roleId, phone } = ctx.request.body as UserBody
    const data = await User.create({ phone, username, nickname, roleId, createdBy: userId, updatedBy: userId });
    return data.toJSON() as UserBody
}

// 状态
export async function serviceUpdateUserStatus(id: number, {status}: {status: any}) {
    return await User.update({ status }, { where: { id } })
}

export async function serviceEditUsers(params: EditUser) {
    await User.update({ ...params }, { where: { id: params.id } })
}

export async function serviceDeleteUsers(ids: any[]) {
    await User.destroy({
        where: { id: { [Op.or]: ids } },
    })
}