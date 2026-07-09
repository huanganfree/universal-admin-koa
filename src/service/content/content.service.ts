import { Content, User } from "../../db"
import { Op } from "sequelize"

export async function serviceCreateContent(params: { [key: string]: any }) {
    const { tags, cover, title, content, userId, ...leftProps } = params
    const res = await Content.create({ tags, cover, title, content, createdBy: userId, updatedBy: userId, ...leftProps })
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
        where: { title: { [Op.like]: `%${title}%` }, status: { [Op.in]: statusArray } },
        order: [['updatedAt', 'DESC']],
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
        where: { title: { [Op.like]: `%${title}%` }, status: 'pending' },
        order: [['updatedAt', 'DESC']],
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

export async function serviceGetDeletedContents(params: { [key: string]: any }) {
    const { page, pageSize, title = '' } = params
    const { count, rows } = await Content.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { title: { [Op.like]: `%${title}%` }, deletedAt: { [Op.ne]: null } },
        order: [['deletedAt', 'DESC']],
        paranoid: false, // 只想查未删除的，必加
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


export async function serviceGetContentDetail(id: (string | number)) {
    const content = await Content.findOne({ where: { id } })
    return content?.toJSON()
}

// 编辑
export async function serviceEditContent(id: (string | number), body: any) {
    await Content.update({ ...body }, { where: { id } })
    return true
}

// 恢复
export async function serviceRestoreContent({ id, status }: { id: any, status: any }) {
    // 1. ✨ 使用官方的 restore 恢复数据（此方法会自动把 deletedAt 设为 null）
    await Content.restore({ where: { id } });
    await Content.update({ status }, { where: { id } })
    return true
}


// 删除
export async function serviceDeleteContent(ids: (string | number)[], isForce: boolean = false) {
    await Content.destroy({
        where: { id: { [Op.in]: ids } },
        force: isForce
    })
}

// 彻底删除
export async function servicePhysicalDeleteContent(ids: (string | number)[]) {
    await serviceDeleteContent(ids, true)
}