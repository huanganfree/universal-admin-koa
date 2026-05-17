import { Context, Next } from "koa";
import { serviceAddRole, serviceDeleteRoles, serviceEditRoles, serviceGetDictItem, serviceGetRoles, serviceGetUserInfo, serviceUpdateRoleStatus } from "../service/system.service";
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

// 获取字典选项
export async function getDictItem(ctx: Context, next: Next) {
    const { dictCode } = ctx.request.query || {}
    if (dictCode) {
        const res = await serviceGetDictItem(dictCode as string)
        responseSuccess(ctx, res)
    } else {
        responseFail(ctx, '字典编码未传', 400)
    }
}


// 新增角色
export interface RoleBody {
    id?: number,
    roleName: string;
    roleCode: string;
    description?: string;
    status?: number;
    createdBy: number;
    updatedBy: number
}
export async function addRole(ctx: Context, next: Next) {
    const { roleName, roleCode } = ctx.request.body as RoleBody
    if (!roleName) {
        responseFail(ctx, '角色名称必填', 400)
    } else if (!roleCode) {
        responseFail(ctx, '角色标识必填', 400)
    } else {
        const res = await serviceAddRole(ctx)
        if (res.id)
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
    if (!page || !pageSize) {
        responseFail(ctx, '分页，页码必填', 400)
    } else {
        const { total, records } = await serviceGetRoles(ctx)
        responseSuccess(ctx, { total, records }, '操作成功！')
    }
}

// 删除角色
export async function deleteRoles(ctx: Context, next: Next) {
    const ids = (ctx.request.body as any[]) || []
    if (!ids?.length) {
        responseFail(ctx, '参数不能为空', 400)
    } else {
        await serviceDeleteRoles(ids) // 参数处理后，直接传入，不传ctx了
        responseSuccess(ctx, null, '操作成功！')
    }
}

// 编辑角色
export interface EditRole {
    id: number,
    roleName?: string;
    roleCode?: string;
    description?: string;
}
export async function editRoles(ctx: Context, next: Next) {
    const editData = ctx.request.body as EditRole
    if (!editData?.id) {
        responseFail(ctx, 'id不能为空', 400)
    } else {
        await serviceEditRoles(editData)
        responseSuccess(ctx, null)
    }
}

export async function updateRoleStatus(ctx: Context, next: Next) {
    const { id } = ctx.params;
    const data = ctx.request.body as { status: number }
    if (!id || id == "null") {
        responseFail(ctx, 'id不能为空', 400)
    } else if (data.status === undefined) {
        responseFail(ctx, 'status不能为空', 400)
    } else {
        const res = await serviceUpdateRoleStatus(id, data)
        if (res[0] <= 0) {
            responseFail(ctx, '未找到记录', 400)
        } else {
            responseSuccess(ctx, null)
        }
    }
}