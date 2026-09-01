"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.userInfo = userInfo;
exports.getUserMenus = getUserMenus;
exports.logout = logout;
exports.postAccessToken = postAccessToken;
const response_1 = require("../utils/response");
const auth_service_1 = require("../service/auth.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const dayjs_1 = __importDefault(require("dayjs"));
const refreshAccessToken_1 = require("../utils/refreshAccessToken");
const redis_1 = require("../redis/redis");
const redisKeysMapping_1 = require("../redis/redisKeysMapping");
async function login(ctx, next) {
    const body = ctx.request.body;
    if (body.phone) {
        const user = await (0, auth_service_1.serviceLogin)(body);
        if (user) {
            const { password, ...leftProps } = user.toJSON();
            if (!leftProps.status) {
                (0, response_1.responseFail)(ctx, "账号已被禁用！", 400);
                return;
            }
            const dbPassword = password;
            if (dbPassword === body.password) {
                const token = jsonwebtoken_1.default.sign({ userId: leftProps.id, phone: body.phone, roleId: leftProps.roleId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                const refresh_Token = jsonwebtoken_1.default.sign({ userId: leftProps.id, phone: body.phone, roleId: leftProps.roleId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
                // 写入 Redis，保存 7 天 (7 * 24 * 60 * 60 = 604800 秒)
                await redis_1.redis.set(`${redisKeysMapping_1.redisKeyMap.refresh_token}:${leftProps.id}`, refresh_Token, "EX", 1 * 24 * 60 * 60);
                await db_1.User.update({ lastLoginTime: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") }, { where: { id: leftProps.id } });
                (0, response_1.responseSuccess)(ctx, {
                    accessToken: token,
                    refreshToken: refresh_Token,
                }, "登录成功");
                next();
            }
            else {
                (0, response_1.responseFail)(ctx, "密码错误", 400);
            }
        }
        else {
            (0, response_1.responseFail)(ctx, "账号或密码错误", 400);
        }
    }
    else {
        (0, response_1.responseFail)(ctx, "请输入账号或密码", 400);
    }
}
async function userInfo(ctx, next) {
    const { userId } = ctx.state.user;
    const user = await (0, auth_service_1.serviceUserInfo)(userId);
    const { Role, ...leftProps } = user?.toJSON();
    (0, response_1.responseSuccess)(ctx, {
        roleName: Role.roleName,
        ...leftProps,
    });
}
// 获取用户菜单权限
async function getUserMenus(ctx, next) {
    const { roleId } = ctx.state.user;
    const menuModels = (await (0, auth_service_1.serviceUserMenus)(roleId));
    (0, response_1.responseSuccess)(ctx, menuModels);
}
// 删除 Redis 中的 Refresh Token
async function logout(ctx, next) {
    const { refreshToken } = ctx.request.body;
    const { userId } = jsonwebtoken_1.default.decode(refreshToken);
    if (userId) {
        try {
            await redis_1.redis.del(`${redisKeysMapping_1.redisKeyMap.refresh_token}:${userId}`);
            (0, response_1.responseSuccess)(ctx, null, "退出登录成功");
        }
        catch (error) {
            (0, response_1.responseFail)(ctx, "退出登录失败", 500);
        }
    }
}
// 重新生成新的Access token
async function postAccessToken(ctx, next) {
    const { refreshToken } = ctx.request.body;
    try {
        const { userId, phone, roleId } = jsonwebtoken_1.default.decode(refreshToken);
        const localRefreshToken = await redis_1.redis.get(`refresh_token:${userId}`);
        if (localRefreshToken == refreshToken) {
            const refresh_Token = (0, refreshAccessToken_1.getRefreshAccessToken)({
                phone: phone,
                roleId: roleId,
                id: userId,
            });
            (0, response_1.responseSuccess)(ctx, refresh_Token, "生成成功");
        }
        else {
            ctx.status = 401;
            (0, response_1.responseFail)(ctx, "请重新登录", 401);
        }
    }
    catch (error) {
        ctx.status = 401;
        (0, response_1.responseFail)(ctx, "请重新登录", 401);
    }
}
