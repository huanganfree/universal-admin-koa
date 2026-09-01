"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const response_1 = require("../utils/response");
// 错误多时，还可以再拆分更细的错误中间件
async function errorMiddleware(ctx, next) {
    try {
        return await next();
    }
    catch (err) {
        console.log('err========', err);
        if (err.status == 401) {
            const errName = err.originalError?.name;
            if (errName == 'TokenExpiredError') {
                // ctx.status = 401;
                (0, response_1.responseFail)(ctx, 'token过期', 401);
            }
            else if (errName == 'JsonWebTokenError') {
                // ctx.status = 400;
                (0, response_1.responseFail)(ctx, '认证失败，请提供有效的 Token', 400);
            }
            else {
                // ctx.status = 400;
                (0, response_1.responseFail)(ctx, err.message, 400);
            }
            return;
        }
        else if (err.name == 'SequelizeUniqueConstraintError') {
            console.log('err.original========', err.original);
            (0, response_1.responseFail)(ctx, '已存在，请勿重复创建！', 400);
            return;
        }
        else { // 其他错误
            (0, response_1.responseFail)(ctx, err.message, 500);
            return;
        }
        // throw err; // 抛给app.on('error')
    }
}
