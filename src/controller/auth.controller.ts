/**
 * 校验参数，调用请求处理业务逻辑，处理响应
 */
import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../utils/response";
import { serviceLogin } from "../service/auth.service";
import JWT from 'jsonwebtoken';
import { User } from "../db";
import dayjs from "dayjs";

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
      const userObj = user.toJSON()
      if(!userObj.status){
        responseFail(ctx, '该用户被禁用！', 400)
        return
      }
      const dbPassword = userObj.password
      if (dbPassword === body.password) {
        const token = JWT.sign(
          { userId: userObj.id, username: body.username },
          process.env.JWT_SECRET as string,
          {expiresIn: '2d'}
        )
        await User.update({ lastLoginTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }, { where: { id: userObj.id } })
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
