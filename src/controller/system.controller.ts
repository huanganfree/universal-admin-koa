import { RouterContext } from "@koa/router";
import { Next } from "koa";
import { responseFail, responseSuccess } from "../utils/response";
import { UserRequestBody } from "../types/appState";

export function login(ctx: RouterContext, next: Next) {
    const body = ctx.request.body as UserRequestBody
    if (body.id) {
        responseSuccess(ctx)
    } else {
        responseFail(ctx, '该用户不存在', 400)
    }
}

export function logout(ctx: RouterContext, next: Next) {

}

export function getUserInfo(ctx: RouterContext, next: Next) {

}