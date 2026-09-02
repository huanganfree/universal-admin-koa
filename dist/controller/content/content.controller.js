"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
exports.createContent = createContent;
exports.getContents = getContents;
exports.getPendingContents = getPendingContents;
exports.getDeletedContents = getDeletedContents;
exports.submitContent = submitContent;
exports.approveContent = approveContent;
exports.rejectContent = rejectContent;
exports.unpublishContent = unpublishContent;
exports.restoreContent = restoreContent;
exports.deleteContent = deleteContent;
exports.physicalDeleteContent = physicalDeleteContent;
exports.getContentDetail = getContentDetail;
exports.editContent = editContent;
const response_1 = require("../../utils/response");
const content_service_1 = require("../../service/content/content.service");
async function uploadFile(ctx, next) {
    if (!ctx.is('multipart/*')) {
        (0, response_1.responseFail)(ctx, '参数格式不对');
        return;
    }
    console.log('ctx.file', ctx.file);
    const { originalname, filename } = ctx.file || {};
    const realName = Buffer.from(originalname, 'latin1').toString('utf8'); // 转码还原正确的中文名
    (0, response_1.responseSuccess)(ctx, {
        originalname: realName,
        filePath: `/uploads/${filename}`
    });
}
async function createContent(ctx) {
    const { userId } = ctx.state.user;
    const { cover, title, content, tags, ...leftProps } = ctx.request.body;
    if (!tags || !cover || !title || !content) {
        (0, response_1.responseFail)(ctx, '是必填项！');
        return;
    }
    await (0, content_service_1.serviceCreateContent)({ tags, cover, title, content, userId, ...leftProps });
    (0, response_1.responseSuccess)(ctx, null);
}
async function getContents(ctx) {
    const { userId, roleId } = ctx.state.user;
    const { page, pageSize, title = '', tags = '', ...leftProps } = ctx.request.query;
    if (!page || !pageSize) {
        (0, response_1.responseFail)(ctx, '分页，页码必填', 400);
    }
    else {
        const { total, records } = await (0, content_service_1.serviceGetContents)({ page, pageSize, title, tags, userId, roleId, ...leftProps });
        (0, response_1.responseSuccess)(ctx, { total, records }, '操作成功！');
    }
}
// 获取待审核内容分页数据
async function getPendingContents(ctx) {
    const { page, pageSize, title = '', ...leftProps } = ctx.request.query;
    const { userId, roleId } = ctx.state.user;
    if (!page || !pageSize) {
        (0, response_1.responseFail)(ctx, '分页，页码必填', 400);
    }
    else {
        const { total, records } = await (0, content_service_1.serviceGetPendingContents)({ page, pageSize, title, userId, roleId, ...leftProps });
        (0, response_1.responseSuccess)(ctx, { total, records }, '操作成功！');
    }
}
// 获取被删除内容
async function getDeletedContents(ctx) {
    const { page, pageSize, title = '', ...leftProps } = ctx.request.query;
    if (!page || !pageSize) {
        (0, response_1.responseFail)(ctx, '分页，页码必填', 400);
    }
    else {
        const { total, records } = await (0, content_service_1.serviceGetDeletedContents)({ page, pageSize, title, ...leftProps });
        (0, response_1.responseSuccess)(ctx, { total, records }, '操作成功！');
    }
}
// 提交审核
async function submitContent(ctx) {
    const { id } = ctx.params;
    if (!id) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        await (0, content_service_1.serviceUpdateContentStatus)({ id, status: 'pending' });
        (0, response_1.responseSuccess)(ctx, null, '提交审核成功！');
    }
}
// 审核通过
async function approveContent(ctx) {
    const { id } = ctx.params;
    if (!id) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        await (0, content_service_1.serviceUpdateContentStatus)({ id, status: 'published' });
        (0, response_1.responseSuccess)(ctx, null, '审核通过成功！');
    }
}
// 驳回内容
async function rejectContent(ctx) {
    const { id } = ctx.params;
    const { remark = '' } = ctx.request.body;
    if (!id || !remark) {
        (0, response_1.responseFail)(ctx, 'id和remark都是必传', 400);
    }
    else {
        await (0, content_service_1.serviceUpdateContentStatus)({ id, status: 'draft', remark });
        (0, response_1.responseSuccess)(ctx, null);
    }
}
// 下线内容
async function unpublishContent(ctx) {
    const { id } = ctx.params;
    if (!id) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        await (0, content_service_1.serviceUpdateContentStatus)({ id, status: 'offline' });
        (0, response_1.responseSuccess)(ctx, null);
    }
}
async function restoreContent(ctx) {
    const { id } = ctx.params;
    if (!id) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        await (0, content_service_1.serviceRestoreContent)({ id, status: 'draft' });
        (0, response_1.responseSuccess)(ctx, null);
    }
}
// 删除内容
async function deleteContent(ctx) {
    const ids = ctx.request.body || [];
    if (!ids?.length) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        await (0, content_service_1.serviceDeleteContent)(ids);
        (0, response_1.responseSuccess)(ctx, null);
    }
}
async function physicalDeleteContent(ctx) {
    const ids = ctx.request.body || [];
    if (!ids?.length) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        await (0, content_service_1.servicePhysicalDeleteContent)(ids);
        (0, response_1.responseSuccess)(ctx, null);
    }
}
// 获取内容详情
async function getContentDetail(ctx) {
    const { id } = ctx.params;
    if (!id) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        const data = await (0, content_service_1.serviceGetContentDetail)(id);
        (0, response_1.responseSuccess)(ctx, data);
    }
}
// 编辑
async function editContent(ctx) {
    const { id } = ctx.params;
    if (!id) {
        (0, response_1.responseFail)(ctx, 'id必传', 400);
    }
    else {
        const { userId } = ctx.state.user;
        const { ...leftProps } = ctx.request.body || {};
        await (0, content_service_1.serviceEditContent)(id, { ...leftProps, updatedBy: userId });
        (0, response_1.responseSuccess)(ctx, null);
    }
}
