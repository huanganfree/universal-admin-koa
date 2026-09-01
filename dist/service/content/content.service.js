"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceCreateContent = serviceCreateContent;
exports.serviceUpdateContentStatus = serviceUpdateContentStatus;
exports.serviceGetContents = serviceGetContents;
exports.serviceGetPendingContents = serviceGetPendingContents;
exports.serviceGetDeletedContents = serviceGetDeletedContents;
exports.serviceGetContentDetail = serviceGetContentDetail;
exports.serviceEditContent = serviceEditContent;
exports.serviceRestoreContent = serviceRestoreContent;
exports.serviceDeleteContent = serviceDeleteContent;
exports.servicePhysicalDeleteContent = servicePhysicalDeleteContent;
const db_1 = require("../../db");
const sequelize_1 = require("sequelize");
async function serviceCreateContent(params) {
    const { tags, cover, title, content, userId, ...leftProps } = params;
    const res = await db_1.Content.create({ tags, cover, title, content, createdBy: userId, updatedBy: userId, ...leftProps });
    return res.toJSON();
}
async function serviceUpdateContentStatus(params) {
    const { id, status, remark } = params;
    await db_1.Content.update({ status, reviewRemark: remark }, { where: { id } });
}
async function serviceGetContents(params) {
    const { page, pageSize, title = '', status = 'draft,published,offline', userId, roleId } = params;
    const statusArray = status.split(',');
    const roleModel = await db_1.Role.findByPk(roleId, { attributes: ['roleCode'] });
    const byUserIdWhere = {};
    if (roleModel?.roleCode === 'editor') {
        byUserIdWhere.createdBy = userId;
    }
    const { count, rows } = await db_1.Content.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { title: { [sequelize_1.Op.like]: `%${title}%` }, status: { [sequelize_1.Op.in]: statusArray }, ...byUserIdWhere },
        order: [['updatedAt', 'DESC']],
        include: [
            {
                model: db_1.User,
                as: 'Creator',
                attributes: ['username']
            },
            {
                model: db_1.User,
                as: 'Updater',
                attributes: ['username']
            }
        ]
    });
    const transformRows = rows.map((el) => {
        const item = el.toJSON();
        if (item.Creator) {
            item.creatorName = item.Creator.username;
            delete item.Creator;
        }
        if (item.Updater) {
            item.updaterName = item.Updater.username;
            delete item.Updater;
        }
        return item;
    });
    return {
        total: count,
        records: transformRows
    };
}
// 获取待审核的内容
async function serviceGetPendingContents(params) {
    const { page, pageSize, title = '', tags = '', userId, roleId } = params;
    const roleModel = await db_1.Role.findByPk(roleId, { attributes: ['roleCode'] });
    const byUserIdWhere = {};
    if (roleModel?.roleCode === 'editor') {
        byUserIdWhere.createdBy = userId;
    }
    const { count, rows } = await db_1.Content.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { title: { [sequelize_1.Op.like]: `%${title}%` }, status: 'pending', ...byUserIdWhere },
        order: [['updatedAt', 'DESC']],
        include: [
            {
                model: db_1.User,
                as: 'Creator',
                attributes: ['username']
            },
            {
                model: db_1.User,
                as: 'Updater',
                attributes: ['username']
            }
        ]
    });
    const transformRows = rows.map((el) => {
        const item = el.toJSON();
        if (item.Creator) {
            item.creatorName = item.Creator.username;
            delete item.Creator;
        }
        if (item.Updater) {
            item.updaterName = item.Updater.username;
            delete item.Updater;
        }
        return item;
    });
    return {
        total: count,
        records: transformRows
    };
}
async function serviceGetDeletedContents(params) {
    const { page, pageSize, title = '' } = params;
    const { count, rows } = await db_1.Content.findAndCountAll({
        offset: (+page - 1) * (+pageSize),
        limit: +pageSize,
        where: { title: { [sequelize_1.Op.like]: `%${title}%` }, deletedAt: { [sequelize_1.Op.ne]: null } },
        order: [['deletedAt', 'DESC']],
        paranoid: false, // 只想查未删除的，必加
        include: [
            {
                model: db_1.User,
                as: 'Creator',
                attributes: ['username']
            },
            {
                model: db_1.User,
                as: 'Updater',
                attributes: ['username']
            }
        ]
    });
    const transformRows = rows.map((el) => {
        const item = el.toJSON();
        if (item.Creator) {
            item.creatorName = item.Creator.username;
            delete item.Creator;
        }
        if (item.Updater) {
            item.updaterName = item.Updater.username;
            delete item.Updater;
        }
        return item;
    });
    return {
        total: count,
        records: transformRows
    };
}
async function serviceGetContentDetail(id) {
    const content = await db_1.Content.findOne({ where: { id } });
    return content?.toJSON();
}
// 编辑
async function serviceEditContent(id, body) {
    await db_1.Content.update({ ...body }, { where: { id } });
    return true;
}
// 恢复
async function serviceRestoreContent({ id, status }) {
    // 1. ✨ 使用官方的 restore 恢复数据（此方法会自动把 deletedAt 设为 null）
    await db_1.Content.restore({ where: { id } });
    await db_1.Content.update({ status }, { where: { id } });
    return true;
}
// 删除
async function serviceDeleteContent(ids, isForce = false) {
    await db_1.Content.destroy({
        where: { id: { [sequelize_1.Op.in]: ids } },
        force: isForce
    });
}
// 彻底删除
async function servicePhysicalDeleteContent(ids) {
    await serviceDeleteContent(ids, true);
}
