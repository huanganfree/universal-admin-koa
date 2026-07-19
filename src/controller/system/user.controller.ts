import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../../utils/response";
import { serviceAddUser, serviceDeleteUsers, serviceEditUsers, serviceGetUsers, serviceUpdateUserStatus } from "../../service/system/user.service";
import { UniqueConstraintError } from "sequelize";


export async function getUsers(ctx: Context, next: Next) {
    const { page, pageSize } = ctx.request.query
    if (!page || !pageSize) {
        responseFail(ctx, '分页，页码必填', 400)
    } else {
        const { total, records } = await serviceGetUsers(ctx)
        responseSuccess(ctx, { total, records }, '操作成功！')
    }
}

// 新增角色
export interface UserBody {
    id?: number;
    username: string;
    nickname: string;
    roleId: number;
    phone: string;
    createdBy: number;
    updatedBy: number
}

export async function addUser(ctx: Context, next: Next) {
    const { username, nickname, roleId } = ctx.request.body as UserBody
    if (!username || !nickname || !roleId) {
        responseFail(ctx, '用户名，角色，昵称三个必填', 400)
    } else {
        try {
            const res = await serviceAddUser(ctx)
            if (res.id)
                responseSuccess(ctx, null, '操作成功！')
        } catch (error) {
            if(error instanceof UniqueConstraintError){
                if(error.fields.username){
                    responseFail(ctx, '已存在相同的用户名，请勿重复创建！', 400);
                } else if(error.fields.phone){
                    responseFail(ctx, '已存在相同的手机号，请检查！', 400);
                }
            }
        }
    }
}

export async function updateUserStatus(ctx: Context, next: Next) {
    const { id } = ctx.params;
    const data = ctx.request.body as { status: number }
    if (!id || id == "null") {
        responseFail(ctx, 'id不能为空', 400)
    } else if (data.status === undefined) {
        responseFail(ctx, 'status不能为空', 400)
    } else {
        const res = await serviceUpdateUserStatus(id, data)
        if (res[0] <= 0) {
            responseFail(ctx, '未找到记录', 400)
        } else {
            responseSuccess(ctx, null)
        }
    }
}

export interface EditUser {
    id: number,
    username: string;
    roleId: string;
    nickname: string;
}
export async function editUser(ctx: Context, next: Next) {
    const editData = ctx.request.body as EditUser
    if (!editData?.id) {
        responseFail(ctx, 'id不能为空', 400)
    } else {
        await serviceEditUsers(editData)
        responseSuccess(ctx, null)
    }
}

export async function deleteUser(ctx: Context, next: Next) {
    const ids = (ctx.request.body as any[]) || []
    if (!ids?.length) {
        responseFail(ctx, '参数不能为空', 400)
    } else {
        await serviceDeleteUsers(ids) // 参数处理后，直接传入，不传ctx了
        responseSuccess(ctx, null, '操作成功！')
    }
}