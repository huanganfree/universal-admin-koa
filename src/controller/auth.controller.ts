import { Context, Next } from "koa";
import { responseFail, responseSuccess } from "../utils/response";
import {
  serviceLogin,
  serviceUserInfo,
  serviceUserMenus,
} from "../service/auth.service";
import JWT, { SignOptions } from "jsonwebtoken";
import { User } from "../db";
import dayjs from "dayjs";
import { getRefreshAccessToken } from "../utils/refreshAccessToken";
import { redis } from "../redis/redis";
import { redisKeyMap } from "../redis/redisKeysMapping";

export interface UserRequestBody {
  phone?: string;
  password?: string;
  id?: any;
}

export async function login(ctx: Context, next: Next) {
  const body = ctx.request.body as UserRequestBody;
  if (body.phone) {
    const user = await serviceLogin(body);
    if (user) {
      const { password, ...leftProps } = user.toJSON();
      if (!leftProps.status) {
        responseFail(ctx, "账号已被禁用！", 400);
        return;
      }
      const dbPassword = password;
      if (dbPassword === body.password) {
        const token = JWT.sign(
          { userId: leftProps.id, phone: body.phone, roleId: leftProps.roleId },
          process.env.JWT_ACCESS_SECRET as string,
          { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] },
        );

        const refresh_Token = JWT.sign(
          { userId: leftProps.id, phone: body.phone, roleId: leftProps.roleId },
          process.env.JWT_REFRESH_SECRET as string,
          { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] },
        );

        // 写入 Redis，保存 7 天 (7 * 24 * 60 * 60 = 604800 秒)
        await redis.set(
          `${redisKeyMap.refresh_token}:${leftProps.id}`,
          refresh_Token,
          "EX",
          1 * 24 * 60 * 60,
        );

        await User.update(
          { lastLoginTime: dayjs().format("YYYY-MM-DD HH:mm:ss") },
          { where: { id: leftProps.id } },
        );
        responseSuccess(
          ctx,
          {
            accessToken: token,
            refreshToken: refresh_Token,
          },
          "登录成功",
        );
        next();
      } else {
        responseFail(ctx, "密码错误", 400);
      }
    } else {
      responseFail(ctx, "账号或密码错误", 400);
    }
  } else {
    responseFail(ctx, "请输入账号或密码", 400);
  }
}

export async function userInfo(ctx: Context, next: Next) {
  const { userId } = ctx.state.user;
  const user = await serviceUserInfo(userId);
  const { Role, ...leftProps } = user?.toJSON();
  responseSuccess(ctx, {
    roleName: Role.roleName,
    ...leftProps,
  });
}

// 获取用户菜单权限
export async function getUserMenus(ctx: Context, next: Next) {
  const { roleId } = ctx.state.user;
  const menuModels = (await serviceUserMenus(roleId)) as { [key: string]: any };
  responseSuccess(ctx, menuModels);
}

// 删除 Redis 中的 Refresh Token
export async function logout(ctx: Context, next: Next) {
  const { refreshToken } = ctx.request.body as { refreshToken: string };
  const { userId } = JWT.decode(refreshToken) as {
    userId: number;
    phone: string;
    roleId: number;
  };
  if (userId) {
    try {
      await redis.del(`${redisKeyMap.refresh_token}:${userId}`);
      responseSuccess(ctx, null, "退出登录成功");
    } catch (error) {
      responseFail(ctx, "退出登录失败", 500);
    }
  }
}

// 重新生成新的Access token
export async function postAccessToken(ctx: Context, next: Next) {
  const { refreshToken } = ctx.request.body as { refreshToken: string };
  try {
    const { userId, phone, roleId } = JWT.decode(refreshToken) as {
      userId: number;
      phone: string;
      roleId: number;
    };
    const localRefreshToken = await redis.get(`refresh_token:${userId}`);
    if (localRefreshToken == refreshToken) {
      const refresh_Token = getRefreshAccessToken({
        phone: phone,
        roleId: roleId,
        id: userId,
      });
      responseSuccess(ctx, refresh_Token, "生成成功");
    } else {
      ctx.status = 401;
      responseFail(ctx, "请重新登录", 401);
    }
  } catch (error) {
    ctx.status = 401;
    responseFail(ctx, "请重新登录", 401);
  }
}
