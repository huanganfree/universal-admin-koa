import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../../utils/response";
import { serviceCreateContent, serviceDeleteContent, serviceGetContents, serviceGetDeletedContents, serviceGetPendingContents, serviceUpdateContentStatus } from "../../service/content/content.service";

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

export async function createContent(ctx: Context) {
    const { userId } = ctx.state.user
    const { cover, title, content, tags, ...leftProps } = ctx.request.body as {[key: string]: any}
    if(!tags || !cover || !title || !content){
        responseFail(ctx, '是必填项！')
        return
    }
    const res = await serviceCreateContent({ tags, cover, title, content, userId, ...leftProps })
    responseSuccess(ctx, null)
}

export async function getContents(ctx: Context) {
    const { page, pageSize, title = '', tags = '', ...leftProps } =  ctx.request.query
    if (!page || !pageSize) {
        responseFail(ctx, '分页，页码必填', 400)
    } else {
        const { total, records } = await serviceGetContents({ page, pageSize, title, tags, ...leftProps })
        responseSuccess(ctx, { total, records }, '操作成功！')
    }
}

export async function getPendingContents(ctx: Context) {
    const { page, pageSize, title = '', tags = '', ...leftProps } =  ctx.request.query
    if (!page || !pageSize) {
        responseFail(ctx, '分页，页码必填', 400)
    } else {
        const { total, records } = await serviceGetPendingContents({ page, pageSize, title, tags, ...leftProps })
        responseSuccess(ctx, { total, records }, '操作成功！')
    }
}

export async function getDeletedContents(ctx: Context){
    const { page, pageSize, title = '', ...leftProps } =  ctx.request.query
    if (!page || !pageSize) {
        responseFail(ctx, '分页，页码必填', 400)
    } else {
        const { total, records } = await serviceGetDeletedContents({ page, pageSize, title, ...leftProps })
        responseSuccess(ctx, { total, records }, '操作成功！')
    }
}

// 提交审核
export async function submitContent(ctx: Context){
    const { id } = ctx.params;
    if(!id){
        responseFail(ctx, 'id必传', 400)
    } else {
        await serviceUpdateContentStatus({ id, status: 'pending' })
        responseSuccess(ctx, null, '提交审核成功！')
    }
}

// 审核通过
export async function approveContent(ctx: Context){
    const { id } = ctx.params;
    if(!id){
        responseFail(ctx, 'id必传', 400)
    } else {
        await serviceUpdateContentStatus({ id, status: 'published' })
        responseSuccess(ctx, null, '审核通过成功！')
    }
}

export async function rejectContent(ctx: Context){
    const { id } = ctx.params;
    const { remark = ''} = ctx.request.body as {[key: string]: any}
    if(!id || !remark){
        responseFail(ctx, 'id和remark都是必传', 400)
    } else {
        await serviceUpdateContentStatus({ id, status: 'draft', remark })
        responseSuccess(ctx, null, '驳回成功！')
    }
}

// 下线内容
export async function unpublishContent(ctx: Context){
    const { id } = ctx.params;
    // const { remark = ''} = ctx.request.body as {[key: string]: any}
    if(!id){
        responseFail(ctx, 'id必传', 400)
    } else {
        await serviceUpdateContentStatus({ id, status: 'offline' })
        responseSuccess(ctx, null, '下线成功！')
    }
}

// 删除
export async function deleteContent(ctx: Context){
    const ids = (ctx.request.body as any[]) || []
    if(!ids?.length){
        responseFail(ctx, 'id必传', 400)
    } else {
        await serviceDeleteContent(ids)
        responseSuccess(ctx, null, '删除成功！')
    }
}
