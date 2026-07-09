import Router from '@koa/router';
import { createMenu, getAllMenus } from '../../controller/system/menu.controller';

const menuRouter = new Router({ prefix:'/api/system' });

// 创建菜单
menuRouter.post('/menu', createMenu)

menuRouter.post('/menu/search', getAllMenus)


export default menuRouter