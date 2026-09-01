"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = getUserInfo;
exports.getDictItem = getDictItem;
exports.addRole = addRole;
exports.getRoles = getRoles;
exports.deleteRoles = deleteRoles;
exports.editRoles = editRoles;
exports.updateRoleStatus = updateRoleStatus;
exports.updateRoleAuth = updateRoleAuth;
exports.getRoleAuth = getRoleAuth;
const system_service_1 = require("../../service/system/system.service");
const response_1 = require("../../utils/response");
// 获取用户信息
async function getUserInfo(ctx, next) {
    const user = (await (0, system_service_1.serviceGetUserInfo)(ctx));
    if (user.id) {
        (0, response_1.responseSuccess)(ctx, user);
    }
    else {
        (0, response_1.responseFail)(ctx, '该用户不存在', 400);
    }
}
// 获取字典选项
async function getDictItem(ctx, next) {
    const { dictCode } = ctx.request.query || {};
    if (dictCode) {
        const res = await (0, system_service_1.serviceGetDictItem)(dictCode);
        (0, response_1.responseSuccess)(ctx, res);
    }
    else {
        (0, response_1.responseFail)(ctx, '字典编码未传', 400);
    }
}
async function addRole(ctx, next) {
    const { roleName, roleCode } = ctx.request.body;
    if (!roleName) {
        (0, response_1.responseFail)(ctx, '角色名称必填', 400);
    }
    else if (!roleCode) {
        (0, response_1.responseFail)(ctx, '角色标识必填', 400);
    }
    else {
        const res = await (0, system_service_1.serviceAddRole)(ctx);
        if (res.id)
            (0, response_1.responseSuccess)(ctx, null, '操作成功！');
    }
}
async function getRoles(ctx, next) {
    const { page, pageSize } = ctx.request.query;
    if (!page || !pageSize) {
        (0, response_1.responseFail)(ctx, '分页，页码必填', 400);
    }
    else {
        const { total, records } = await (0, system_service_1.serviceGetRoles)(ctx);
        (0, response_1.responseSuccess)(ctx, { total, records }, '操作成功！');
    }
}
// 删除角色
async function deleteRoles(ctx, next) {
    const ids = ctx.request.body || [];
    if (!ids?.length) {
        (0, response_1.responseFail)(ctx, '参数不能为空', 400);
    }
    else {
        await (0, system_service_1.serviceDeleteRoles)(ids); // 参数处理后，直接传入，不传ctx了
        (0, response_1.responseSuccess)(ctx, null, '操作成功！');
    }
}
async function editRoles(ctx, next) {
    const editData = ctx.request.body;
    if (!editData?.id) {
        (0, response_1.responseFail)(ctx, 'id不能为空', 400);
    }
    else {
        await (0, system_service_1.serviceEditRoles)(editData);
        (0, response_1.responseSuccess)(ctx, null);
    }
}
async function updateRoleStatus(ctx, next) {
    const { id } = ctx.params;
    const data = ctx.request.body;
    if (!id || id == "null") {
        (0, response_1.responseFail)(ctx, 'id不能为空', 400);
    }
    else if (data.status === undefined) {
        (0, response_1.responseFail)(ctx, 'status不能为空', 400);
    }
    else {
        const res = await (0, system_service_1.serviceUpdateRoleStatus)(id, data);
        if (res[0] <= 0) {
            (0, response_1.responseFail)(ctx, '未找到记录', 400);
        }
        else {
            (0, response_1.responseSuccess)(ctx, null);
        }
    }
}
/**
 * 角色权限
 * @param ctx
 * @returns
 */
async function updateRoleAuth(ctx) {
    const { menuIds } = ctx.request.body;
    const { id } = ctx.params;
    if (!menuIds || !id) {
        (0, response_1.responseFail)(ctx, '角色id，菜单id必填项！');
        return;
    }
    await (0, system_service_1.serviceUpdateRoleAuth)(id, menuIds);
    (0, response_1.responseSuccess)(ctx, null, '操作成功！');
}
async function getRoleAuth(ctx) {
    const { id } = ctx.request.query;
    if (!id) {
        (0, response_1.responseFail)(ctx, '角色id必填项！');
        return;
    }
    const res = await (0, system_service_1.serviceGetRoleAuth)(id);
    (0, response_1.responseSuccess)(ctx, res, '操作成功！');
}
