import { Context, Next } from "koa";
import { serviceAddRole, serviceGetUserInfo } from "../service/system.service";
import { responseFail, responseSuccess } from "../utils/response";
import { UserRequestBody } from "./auth.controller";

export async function getUserInfo(ctx: Context, next: Next) {
    const user = (await serviceGetUserInfo(ctx)) as UserRequestBody
    if (user.id) {
        responseSuccess(ctx, user)
    } else {
        responseFail(ctx, '该用户不存在', 400)
    }
}

export interface RoleBody {
    id?:number,
    roleName: string;
    roleCode: string;
    description?: string;
    status?: number;
    createdBy: number;
    updatedBy: number
}

// 新增角色
export async function addRole(ctx: Context, next: Next) {
    const { roleName, roleCode } = ctx.request.body as RoleBody
    if(!roleName){
        responseFail(ctx, '角色名称必填', 400)
    } else if(!roleCode){
        responseFail(ctx, '角色标识必填', 400)
    } else {
        const res = await serviceAddRole(ctx)
        if(res.id)
        responseSuccess(ctx, null, '操作成功！')
    }
}