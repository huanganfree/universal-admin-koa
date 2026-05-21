/**
 * 处理业务逻辑，调用数据库
 */
import { Context } from "koa";
import { Role, User, SysDictItem } from "../../db";
import { Op } from "sequelize";

export async function serviceGetUsers(ctx: Context) {
    const { page = 1, pageSize = 10, username = '' } = ctx.request.query
    const { count, rows } = await User.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: username ? { username: { [Op.like]: `%${username}%` } } : {}, // 模糊查询
        order: [['createdAt', 'DESC']]
    })
    return {
        total: count,
        records: rows
    }
}