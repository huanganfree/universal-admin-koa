import { Context, Next } from "koa";
import { responseFail } from "../utils/response";
import { UniqueConstraintError } from "sequelize";

// 错误多时，还可以再拆分更细的错误中间件
export async function errorMiddleware(ctx: Context, next: Next) {
    try {
        return await next();
    } catch (err: any) {
        console.log('err========', err);
        if (err.status == 401) {
            ctx.status = 401;
            const errName = err.originalError?.name
            if (errName == 'TokenExpiredError') {
                responseFail(ctx, 'token过期', 401);
            } else if (errName == 'JsonWebTokenError') {
                responseFail(ctx, '认证失败，请提供有效的 Token', 400);
            } else {
                responseFail(ctx, err.message, 400);
            }
            return
        } else if (err.name == 'SequelizeUniqueConstraintError') {
            console.log('err.original========', err.original);
            responseFail(ctx, '已存在，请勿重复创建！', 400);
            return
        } else {// 其他错误，服务器内部错误
            responseFail(ctx, err.message, 500);
            return
        }
        // throw err; // 抛给app.on('error')
    }
}