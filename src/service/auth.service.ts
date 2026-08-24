import { UserRequestBody } from "../controller/auth.controller";
import { MenuModel, Role, RoleMenuModel, User } from "../db";

export async function serviceLogin(params: UserRequestBody) {
    const { phone } = params
    const user = await User.findOne({ where: { phone }, include: {model: Role, attributes: ['roleName']} })
    return user
}

export async function serviceUserInfo(userId: string | number) {
    const user = await User.findOne({ where: { id: userId }, include: {model: Role, attributes: ['roleName']} })
    return user
}

// 根据角色查菜单权限
export async function serviceUserMenus(roleId: string | number) {
    const menusData = await Role.findByPk(roleId, { include: {model: MenuModel, as: 'menuModels', through: {attributes: []}} })
    return menusData?.menuModels ?? [];
}