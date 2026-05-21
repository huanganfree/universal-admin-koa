
import Router from '@koa/router';
import { getUsers } from '../../controller/system/user.controller';

const userRouter = new Router({ prefix:'/api/system' });

// 用户列表
userRouter.get('/users/search', getUsers)


export default userRouter