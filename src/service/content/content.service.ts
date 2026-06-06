import { Context } from "koa"
import { Content } from "../../db"
import { Op } from "sequelize"


export async function serviceCreateContent(params: { [key: string]: any }) {
    const { tags, cover, title, content, userId } = params
    const res = await Content.create({ tags, cover, title, content, createdBy: userId, updatedBy: userId })
    return res.toJSON()
}


export async function serviceGetContents(params: { [key: string]: any }) {
    const { page, pageSize, title = '', tags = '' } = params
    const { count, rows } = await Content.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { title: { [Op.like]: `%${title}%` } },
        order: [['createdAt', 'DESC']],
    })

    return {
        total: count,
        records: rows
    }
}