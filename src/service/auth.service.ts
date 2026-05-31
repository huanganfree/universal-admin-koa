/**
 * 处理业务逻辑，调用数据库
 */
import { UserRequestBody } from "../controller/auth.controller";
import { Role, User } from "../db";

export async function serviceLogin(params: UserRequestBody) {
    const { phone } = params
    const user = await User.findOne({ where: { phone }, include: {model: Role, attributes: ['roleName']} })
    return user
}

export async function serviceUserInfo(userId: string | number) {
    const user = await User.findOne({ where: { id: userId }, include: {model: Role, attributes: ['roleName']} })
    return user
}