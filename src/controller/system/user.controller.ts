import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../../utils/response";
import { serviceGetUsers } from "../../service/system/user.service";


export async function getUsers(ctx: Context, next: Next) {
    const { page, pageSize } = ctx.request.query
    if (!page || !pageSize) {
        responseFail(ctx, '分页，页码必填', 400)
    } else {
        const { total, records } = await serviceGetUsers(ctx)
        responseSuccess(ctx, { total, records }, '操作成功！')
    }
}