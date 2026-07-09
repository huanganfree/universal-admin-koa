import { MenuSearchBody } from "../../controller/system/menu.controller"
import { Content, MenuModel } from "../../db"
import { MenuType } from "../../model/system/menu"

export async function serviceCreateMenu(body: { [key: string]: any }) {
    const { name,type , ...leftProps } = body  as MenuType
    await MenuModel.create({ name, type , ...leftProps })
}

export async function serviceGetAllMenus(body: MenuSearchBody) {
    const { current, pageSize , ...leftProps } = body
    await MenuModel.findAndCountAll({ 
        limit: pageSize,
        offset: current,
        where: {
            ...leftProps
        }
     })
}