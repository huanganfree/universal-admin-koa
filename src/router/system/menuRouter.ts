import Router from '@koa/router';
import { createMenu, deleteMenus, eidtMenu, enabledMenu, getAllMenus } from '../../controller/system/menu.controller';

const menuRouter = new Router({ prefix:'/api/system' });

// 创建菜单
menuRouter.post('/menu/create', createMenu)

menuRouter.put('/menu/edit', eidtMenu)

menuRouter.get('/menu/search', getAllMenus)

menuRouter.put('/menu/:id/status', enabledMenu)

menuRouter.delete('/menu/delete', deleteMenus)


export default menuRouter