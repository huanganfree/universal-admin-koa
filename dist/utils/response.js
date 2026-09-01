"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseSuccess = responseSuccess;
exports.responseFail = responseFail;
function responseSuccess(ctx, data = null, msg = '操作成功') {
    ctx.body = {
        code: 200,
        data,
        msg
    };
}
;
function responseFail(ctx, msg = '操作失败', code = 500) {
    ctx.body = {
        code,
        data: null,
        msg
    };
}
;
