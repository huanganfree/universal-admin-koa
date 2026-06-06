import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../../utils/response";
import { serviceCreateContent, serviceGetContents } from "../../service/content/content.service";

export async function uploadFile(ctx: Context, next: Next) {
    if(!ctx.is('multipart/*')){
        responseFail(ctx, '参数格式不对')
        return
    }
    console.log('ctx.file', ctx.file);
    const { originalname, filename } = ctx.file || {}
    responseSuccess(ctx, {
        originalname: originalname,
        filePath: `http://${process.env.DB_HOST}:${process.env.PORT}/uploads/${filename}`
    })
}

export async function createContent(ctx: Context, next: Next) {
    const { userId } = ctx.state.user
    const { cover, title, content, tags } = ctx.request.body as {[key: string]: any}
    if(!tags || !cover || !title || !content){
        responseFail(ctx, '是必填项！')
        return
    }
    const res = serviceCreateContent({ tags, cover, title, content, userId })
    responseSuccess(ctx, null)
}

export async function getContents(ctx: Context, next: Next) {
    const { page, pageSize, title = '', tags = '' } =  ctx.request.query
    if (!page || !pageSize) {
        responseFail(ctx, '分页，页码必填', 400)
    } else {
        const { total, records } = await serviceGetContents({ page, pageSize, title, tags })
        responseSuccess(ctx, { total, records }, '操作成功！')
    }
}