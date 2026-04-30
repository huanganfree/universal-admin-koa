import { getUserInfo, login, logout } from "../controller/system.controller";
import Router from '@koa/router';

const router = new Router({ prefix:'/api/auth' });

router.post('/login', login)
router.post('/logout', logout)
router.get('/userInfo', getUserInfo)

export default router