import { addRole, getRoles, getUserInfo } from "../controller/system.controller";
import Router from '@koa/router';

const router = new Router({ prefix:'/api/system' });

router.get('/userInfo', getUserInfo)  

router.post('/role', addRole)

router.get('/roles/search', getRoles)

export default router