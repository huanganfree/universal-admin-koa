"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMenu = createMenu;
exports.eidtMenu = eidtMenu;
exports.getAllMenus = getAllMenus;
exports.deleteMenus = deleteMenus;
exports.enabledMenu = enabledMenu;
const response_1 = require("../../utils/response");
const menu_service_1 = require("../../service/system/menu.service");
const db_1 = require("../../db");
const sequelize_1 = require("sequelize");
async function createMenu(ctx) {
    const { name, type, ...leftProps } = ctx.request.body;
    if (!name || !type) {
        (0, response_1.responseFail)(ctx, '必填项！');
        return;
    }
    try {
        await (0, menu_service_1.serviceCreateMenu)({ name, type, ...leftProps });
        (0, response_1.responseSuccess)(ctx, null);
    }
    catch (error) {
        if (error instanceof sequelize_1.UniqueConstraintError) {
            if (error.fields.uk_parent_name) {
                (0, response_1.responseFail)(ctx, '已存在相同的菜单，请勿重复创建！', 400);
            }
        }
    }
}
async function eidtMenu(ctx) {
    const { name, type, ...leftProps } = ctx.request.body;
    if (!name || !type) {
        (0, response_1.responseFail)(ctx, '必填项！');
        return;
    }
    await (0, menu_service_1.serviceEditMenu)({ name, type, ...leftProps });
    (0, response_1.responseSuccess)(ctx, null);
}
async function getAllMenus(ctx) {
    const { ...leftProps } = ctx.request.query;
    const data = await (0, menu_service_1.serviceGetAllMenus)({ ...leftProps });
    (0, response_1.responseSuccess)(ctx, data);
}
async function deleteMenus(ctx) {
    const ids = ctx.request.body || [];
    if (!ids?.length) {
        (0, response_1.responseFail)(ctx, '参数不能为空', 400);
    }
    else {
        await (0, menu_service_1.serviceDeleteMenus)(ids);
        (0, response_1.responseSuccess)(ctx, null, '操作成功！');
    }
}
// 校验父级菜单是否启用
const checkParents = (id, allMenus) => {
    const obj = allMenus.find((m) => m.id == Number(id));
    if ((obj.parentId === null || obj.parentId == 0)) {
        return { success: true };
    }
    const parent = allMenus.find((m) => m.id == Number(obj.parentId));
    if (parent.status === 0) {
        return { success: false };
    }
    return checkParents(parent.id, allMenus);
};
// 父级禁用，子级都禁用，获取所有子级id
function checkAllChildIds(id, allMenus) {
    const ids = [];
    ids.push(id);
    const func = (currentId) => {
        const currentObj = allMenus.find((m) => m.parentId == Number(currentId));
        if (currentObj) {
            ids.push(currentObj.id);
            func(currentObj.id);
        }
    };
    func(id);
    return ids.map(item => Number(item));
}
// 启用，禁用
async function enabledMenu(ctx) {
    const { status } = ctx.request.body;
    const { id } = ctx.params;
    if (!id || status === undefined) {
        (0, response_1.responseFail)(ctx, 'id，status是必填项！');
        return;
    }
    const menuList = await db_1.MenuModel.findAll({});
    if (status == 1) { // 启用（要提示用户启用父级）
        const result = checkParents(id, menuList);
        if (!result.success) {
            // 拿到刹车带回来的文案，用你的标准函数返回，既不崩溃，前端也能拿到提示
            return (0, response_1.responseFail)(ctx, `该菜单有父级未启用！`, 400);
        }
    }
    else { // 禁用（默认把父节点下所有子级都禁用，就不用提示了），这里就是要查出修改的菜单下所有的子级菜单的id
        const allChildIds = checkAllChildIds(id, menuList);
        console.log('allChildIds==', allChildIds);
        // 开启数据库事务，确保自己和子孙状态修改的绝对一致
        const t = await db_1.sequelize.transaction();
        try {
            // 2. 如果它底下有子孙（数组不为空），利用 Sequelize 的 Op.in 一行代码批量全干掉
            if (allChildIds.length > 0) {
                await db_1.MenuModel.update({ status: 0 }, // 目标状态
                {
                    where: {
                        id: { [sequelize_1.Op.in]: allChildIds } // 🚀 降维打击：用 IN 语句一次性批量修改
                    },
                    transaction: t
                });
            }
            await t.commit();
            return (0, response_1.responseSuccess)(ctx, null, '菜单及其子菜单已全部禁用');
        }
        catch (error) {
            // 发生异常全额回滚
            await t.rollback();
            return (0, response_1.responseFail)(ctx, '数据库操作失败', 500);
        }
    }
    await (0, menu_service_1.serviceUpdateMenuStatus)({ id, status });
    (0, response_1.responseSuccess)(ctx, null);
}
