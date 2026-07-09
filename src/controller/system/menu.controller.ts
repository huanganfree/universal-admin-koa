import { Context } from "koa";
import { responseFail, responseSuccess } from "../../utils/response";
import { serviceCreateMenu, serviceGetAllMenus } from "../../service/system/menu.service";

export async function createMenu(ctx: Context) {
    const { name, type, ...leftProps } = ctx.request.body as {[key: string]: any}
    
    if(!name || !type){
        responseFail(ctx, '必填项！')
        return
    }
    await serviceCreateMenu({ name, type, ...leftProps })
    responseSuccess(ctx, null)
}

export interface MenuSearchBody {
    current: number;
    pageSize: number;
    name?: string;
    roleId?: number;
  }

export async function getAllMenus(ctx: Context) {
    const { current, pageSize, ...leftProps } = ctx.request.body as MenuSearchBody
    if(!current || !pageSize){
        responseFail(ctx, '分页，页码必填', 400)
        return
    }
    await serviceGetAllMenus({ current, pageSize, ...leftProps })
    responseSuccess(ctx, null)
}