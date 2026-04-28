import { RouterContext } from "@koa/router";

export function responseSuccess(ctx: RouterContext, data: any | null = null, msg = '操作成功') {
    ctx.body = {
        code: 200,
        data,
        msg
    };
};

export function responseFail(ctx: RouterContext, msg = '操作失败', code = 500) {
    ctx.body = {
        code,
        data: null,
        msg
    };
};