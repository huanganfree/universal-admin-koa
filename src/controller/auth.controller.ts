/**
 * 校验参数，调用请求处理业务逻辑，处理响应
 */
import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../utils/response";
import { serviceLogin, serviceUserInfo } from "../service/auth.service";
import JWT from 'jsonwebtoken';
import { User } from "../db";
import dayjs from "dayjs";

export interface UserRequestBody {
  phone?: string;
  password?: string;
  id?: any
}

export async function login(ctx: Context, next: Next) {
  const body = ctx.request.body as UserRequestBody
  if (body.phone) {
    const user = await serviceLogin(body)
    if (user) {
      const {password, ...leftProps} = user.toJSON()
      if(!leftProps.status){
        responseFail(ctx, '账号已被禁用！', 400)
        return
      }
      const dbPassword = password
      if (dbPassword === body.password) {
        const token = JWT.sign(
          { userId: leftProps.id, phone: body.phone },
          process.env.JWT_SECRET as string,
          {expiresIn: '2d'}
        )
        await User.update({ lastLoginTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }, { where: { id: leftProps.id } })
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

export async function userInfo(ctx: Context, next: Next) {
  const { userId } = ctx.state.user
  const user = await serviceUserInfo(userId)
  const {Role, ...leftProps} = user?.toJSON()
  responseSuccess(ctx, {
    roleName: Role.roleName,
    ...leftProps
  })
}

export function logout(ctx: Context, next: Next) {

}
