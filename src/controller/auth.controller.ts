/**
 * 校验参数，调用请求处理业务逻辑，处理响应
 */
import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../utils/response";
import { serviceLogin } from "../service/auth.service";
import JWT from 'jsonwebtoken';

export interface UserRequestBody {
  username?: string;
  password?: string;
  id?: any
}

export async function login(ctx: Context, next: Next) {
  const body = ctx.request.body as UserRequestBody
  if (body.username) {
    const user = await serviceLogin(body)
    if (user) {
      const dbPassword = user.getDataValue('password') as string
      if (dbPassword === body.password) {
        const token = JWT.sign(
          { userId: user.getDataValue('id'), username: body.username },
          process.env.JWT_SECRET as string,
          {expiresIn: '2d'}
        )
        responseSuccess(ctx, token, '登录成功')
        next()
      } else {
        responseFail(ctx, '密码错误', 400)
      }
    } else {
      responseFail(ctx, '账号或密码错误', 400)
    }
  } else {
    responseFail(ctx, '请输入账号或密码', 400)
  }
}

export function logout(ctx: Context, next: Next) {

}
