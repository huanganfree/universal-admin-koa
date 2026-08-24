import { getUserMenus, login, userInfo } from "../controller/auth.controller";
import Router from '@koa/router';

const router = new Router({ prefix:'/api/auth' });

router.post('/login', login)
// router.post('/logout', logout)

// 获取用户信息
router.get('/userInfo', userInfo)

router.get('/menus', getUserMenus)
export default router