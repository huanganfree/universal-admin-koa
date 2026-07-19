import { Context } from "koa";
import { responseFail, responseSuccess } from "../../utils/response";
import { serviceCreateMenu, serviceDeleteMenus, serviceEditMenu, serviceGetAllMenus, serviceUpdateMenuStatus } from "../../service/system/menu.service";
import { MenuType } from "../../model/system/menu";
import { MenuModel, sequelize } from "../../db";
import { Op, UniqueConstraintError, ValidationError } from "sequelize";

export async function createMenu(ctx: Context) {
    const { name, type, ...leftProps } = ctx.request.body as MenuType

    if (!name || !type) {
        responseFail(ctx, '必填项！')
        return
    }
    try {
        await serviceCreateMenu({ name, type, ...leftProps })
        responseSuccess(ctx, null)
    } catch (error) {
        if(error instanceof UniqueConstraintError){
            if(error.fields.uk_parent_name){
                responseFail(ctx, '已存在相同的菜单，请勿重复创建！', 400);
            }
        }
    }
}

export async function eidtMenu(ctx: Context) {
    const { name, type, ...leftProps } = ctx.request.body as MenuType

    if (!name || !type) {
        responseFail(ctx, '必填项！')
        return
    }
    await serviceEditMenu({ name, type, ...leftProps })
    responseSuccess(ctx, null)
}

export interface MenuSearchParamsType {
    name?: string;
}
export async function getAllMenus(ctx: Context) {
    const { ...leftProps } = ctx.request.query as unknown as MenuSearchParamsType;
    const data = await serviceGetAllMenus({ ...leftProps })
    responseSuccess(ctx, data)
}


export async function deleteMenus(ctx: Context) {
    const ids = (ctx.request.body as any[]) || []
    if (!ids?.length) {
        responseFail(ctx, '参数不能为空', 400)
    } else {
        await serviceDeleteMenus(ids)
        responseSuccess(ctx, null, '操作成功！')
    }
}


// 校验父级菜单是否启用
const checkParents = (id: number | null | undefined, allMenus: any[]): { success: boolean } => {
    const obj = allMenus.find((m: any) => m.id == Number(id));
    if ((obj.parentId === null || obj.parentId == 0)) {
        return { success: true };
    }
    const parent = allMenus.find((m: any) => m.id == Number(obj.parentId));

    if (parent.status === 0) {
        return { success: false };
    }

    return checkParents(parent.id, allMenus);
};


// 父级禁用，子级都禁用，获取所有子级id
function checkAllChildIds(id: number, allMenus: any[]) {
    const ids: Array<number> = []
    ids.push(id)
    const func = (currentId: number) => {
        const currentObj = allMenus.find((m: any) => m.parentId == Number(currentId))
        if (currentObj) {
            ids.push(currentObj.id)
            func(currentObj.id)
        }
    }
    func(id)
    return ids.map(item => Number(item))
}

// 启用，禁用
export async function enabledMenu(ctx: Context) {
    const { status } = ctx.request.body as MenuType
    const { id } = ctx.params;
    if (!id || status === undefined) {
        responseFail(ctx, 'id，status是必填项！')
        return
    }
    const menuList = await MenuModel.findAll({})
    if (status == 1) { // 启用（要提示用户启用父级）
        const result = checkParents(id, menuList);
        if (!result.success) {
            // 拿到刹车带回来的文案，用你的标准函数返回，既不崩溃，前端也能拿到提示
            return responseFail(ctx, `该菜单有父级未启用！`, 400);
        }
    } else { // 禁用（默认把父节点下所有子级都禁用，就不用提示了），这里就是要查出修改的菜单下所有的子级菜单的id
        const allChildIds = checkAllChildIds(id, menuList)
        console.log('allChildIds==', allChildIds);
        // 开启数据库事务，确保自己和子孙状态修改的绝对一致
        const t = await sequelize.transaction();

        try {
            // 2. 如果它底下有子孙（数组不为空），利用 Sequelize 的 Op.in 一行代码批量全干掉
            if (allChildIds.length > 0) {
                await MenuModel.update(
                    { status: 0 }, // 目标状态
                    {
                        where: {
                            id: { [Op.in]: allChildIds } // 🚀 降维打击：用 IN 语句一次性批量修改
                        },
                        transaction: t
                    }
                );
            }
            await t.commit();
            return responseSuccess(ctx, null, '菜单及其子菜单已全部禁用');
        } catch (error) {
            // 发生异常全额回滚
            await t.rollback();
            return responseFail(ctx, '数据库操作失败', 500);
        }

    }

    await serviceUpdateMenuStatus({ id, status })
    responseSuccess(ctx, null)
}