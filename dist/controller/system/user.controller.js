"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUserStatus = updateUserStatus;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
const response_1 = require("../../utils/response");
const user_service_1 = require("../../service/system/user.service");
const sequelize_1 = require("sequelize");
async function getUsers(ctx, next) {
    const { page, pageSize } = ctx.request.query;
    if (!page || !pageSize) {
        (0, response_1.responseFail)(ctx, '分页，页码必填', 400);
    }
    else {
        const { total, records } = await (0, user_service_1.serviceGetUsers)(ctx);
        (0, response_1.responseSuccess)(ctx, { total, records }, '操作成功！');
    }
}
async function addUser(ctx, next) {
    const { username, nickname, roleId } = ctx.request.body;
    if (!username || !nickname || !roleId) {
        (0, response_1.responseFail)(ctx, '用户名，角色，昵称三个必填', 400);
    }
    else {
        try {
            const res = await (0, user_service_1.serviceAddUser)(ctx);
            if (res.id)
                (0, response_1.responseSuccess)(ctx, null, '操作成功！');
        }
        catch (error) {
            if (error instanceof sequelize_1.UniqueConstraintError) {
                if (error.fields.username) {
                    (0, response_1.responseFail)(ctx, '已存在相同的用户名，请勿重复创建！', 400);
                }
                else if (error.fields.phone) {
                    (0, response_1.responseFail)(ctx, '已存在相同的手机号，请检查！', 400);
                }
            }
        }
    }
}
async function updateUserStatus(ctx, next) {
    const { id } = ctx.params;
    const data = ctx.request.body;
    if (!id || id == "null") {
        (0, response_1.responseFail)(ctx, 'id不能为空', 400);
    }
    else if (data.status === undefined) {
        (0, response_1.responseFail)(ctx, 'status不能为空', 400);
    }
    else {
        const res = await (0, user_service_1.serviceUpdateUserStatus)(id, data);
        if (res[0] <= 0) {
            (0, response_1.responseFail)(ctx, '未找到记录', 400);
        }
        else {
            (0, response_1.responseSuccess)(ctx, null);
        }
    }
}
async function editUser(ctx, next) {
    const editData = ctx.request.body;
    if (!editData?.id) {
        (0, response_1.responseFail)(ctx, 'id不能为空', 400);
    }
    else {
        await (0, user_service_1.serviceEditUsers)(editData);
        (0, response_1.responseSuccess)(ctx, null);
    }
}
async function deleteUser(ctx, next) {
    const ids = ctx.request.body || [];
    if (!ids?.length) {
        (0, response_1.responseFail)(ctx, '参数不能为空', 400);
    }
    else {
        await (0, user_service_1.serviceDeleteUsers)(ids); // 参数处理后，直接传入，不传ctx了
        (0, response_1.responseSuccess)(ctx, null, '操作成功！');
    }
}
