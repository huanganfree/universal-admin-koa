import { login, logout, userInfo } from "../controller/auth.controller";
import Router from '@koa/router';

const router = new Router({ prefix:'/api/auth' });

router.post('/login', login)
router.post('/logout', logout)

router.get('/userInfo', userInfo)

export default router