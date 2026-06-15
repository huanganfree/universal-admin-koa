import { Content, User } from "../../db"
import { Op } from "sequelize"


export async function serviceCreateContent(params: { [key: string]: any }) {
    const { tags, cover, title, content, userId } = params
    const res = await Content.create({ tags, cover, title, content, createdBy: userId, updatedBy: userId })
    return res.toJSON()
}

export async function serviceUpdateContentStatus(params: { [key: string]: any }) {
    const { id, status, remark } = params
    await Content.update({ status, reviewRemark: remark }, { where: { id } })
}

export async function serviceGetContents(params: { [key: string]: any }) {
    const { page, pageSize, title = '', status = 'draft,published,offline' } = params
    const statusArray = status.split(',')
    const { count, rows } = await Content.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { title: { [Op.like]: `%${title}%`}, status: {[Op.in]: statusArray}  },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                as: 'Creator',
                attributes: ['username']
            },
            {
                model: User,
                as: 'Updater',
                attributes: ['username']
            }
        ]
    })

    const transformRows = rows.map((el: any) => {
        const item = el.toJSON()
        if (item.Creator) {
            item.creatorName = item.Creator.username;
            delete item.Creator
        }

        if (item.Updater) {
            item.updaterName = item.Updater.username;
            delete item.Updater
        }
        
        return item
    })

    return {
        total: count,
        records: transformRows
    }
}

// 获取待审核的内容
export async function serviceGetPendingContents(params: { [key: string]: any }) {
    const { page, pageSize, title = '', tags = '' } = params
    const { count, rows } = await Content.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { title: { [Op.like]: `%${title}%`}, status: 'pending' },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                as: 'Creator',
                attributes: ['username']
            },
            {
                model: User,
                as: 'Updater',
                attributes: ['username']
            }
        ]
    })

    const transformRows = rows.map((el: any) => {
        const item = el.toJSON()
        if (item.Creator) {
            item.creatorName = item.Creator.username;
            delete item.Creator
        }

        if (item.Updater) {
            item.updaterName = item.Updater.username;
            delete item.Updater
        }
        
        return item
    })

    return {
        total: count,
        records: transformRows
    }
}