import { Op } from "sequelize"
import { MenuModel } from "../../db"
import { MenuType } from "../../model/system/menu"
import { MenuSearchParamsType } from "../../controller/system/menu.controller"

export async function serviceCreateMenu(body: { [key: string]: any }) {
    const { name, type, ...leftProps } = body as MenuType
    await MenuModel.create({ name, type, ...leftProps })
}

export async function serviceEditMenu(body: { [key: string]: any }) {
    const { id, name, type, ...leftProps } = body as MenuType
    await MenuModel.update({ name, type, ...leftProps }, { where: { id } })
}

// 更新启用，禁用状态
export async function serviceUpdateMenuStatus({ id, status }: { id: number, status: string }) {
    await MenuModel.update({ status }, { where: { id } })
}

export async function serviceDeleteMenus(ids: any[]) {
    await MenuModel.destroy({
        where: { id: { [Op.or]: ids } },
    })
}

export async function serviceGetAllMenus(body: MenuSearchParamsType) {
    const { name = '', ...leftProps } = body
    const data = await MenuModel.findAll({
        where: {
            name: {
                [Op.like]: `%${name}%`,
            },
            ...leftProps
        },
        order: [['parentId', 'ASC'], ['sort', 'ASC']],
    })
    return data
}