import { Context, Next } from "koa";
import { serviceAddRole, serviceGetRoles, serviceGetUserInfo } from "../service/system.service";
import { responseFail, responseSuccess } from "../utils/response";
import { UserRequestBody } from "./auth.controller";

// 获取用户信息
export async function getUserInfo(ctx: Context, next: Next) {
    const user = (await serviceGetUserInfo(ctx)) as UserRequestBody
    if (user.id) {
        responseSuccess(ctx, user)
    } else {
        responseFail(ctx, '该用户不存在', 400)
    }
}

// 新增角色
export interface RoleBody {
    id?:number,
    roleName: string;
    roleCode: string;
    description?: string;
    status?: number;
    createdBy: number;
    updatedBy: number
}
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

// 获取角色
export interface RoleSearch {
    page: number,
    pageSize: number,
    roleName?: string
}
export async function getRoles(ctx: Context, next: Next) {
    const { page, pageSize } = ctx.request.query
    if(!page || !pageSize){
        responseFail(ctx, '分页，页码必填', 400)
    }  else {
        const { total, records } = await serviceGetRoles(ctx)
        responseSuccess(ctx, {total, records}, '操作成功！')
    }
}