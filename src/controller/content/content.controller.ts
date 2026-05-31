import { Context, Next } from "koa";
import { responseSuccess } from "../../utils/response";

export async function uploadFile(ctx: Context, next: Next) {
    const { userId } = ctx.state.user
    console.log('ctx.file', ctx.file);
    const { originalname, filename } = ctx.file || {}
    responseSuccess(ctx, {
        originalname: originalname,
        filePath: `${process.env.DB_HOST}:${process.env.PORT}/uploads/${filename}`
    })
}