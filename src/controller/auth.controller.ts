import { RouterContext } from "@koa/router";
import { Next } from "koa";
import { responseFail, responseSuccess } from "../utils/response";
import { UserRequestBody } from "../types/appState";

export function login(ctx: RouterContext, next: Next) {
    const body = ctx.request.body as UserRequestBody
    if (body.username == 'ha') {
        responseSuccess(ctx, 'xxaaa')
    } else {
        responseFail(ctx, undefined, 400)
    }
}

export function logout(ctx: RouterContext, next: Next) {

}

export function getUserInfo(ctx: RouterContext, next: Next) {

}