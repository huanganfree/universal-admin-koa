
import Router from '@koa/router';
import { addUser, deleteUser, editUser, getUsers, updateUserStatus } from '../../controller/system/user.controller';

const userRouter = new Router({ prefix:'/api/system' });

// 用户列表
userRouter.get('/users/search', getUsers)

userRouter.post('/user/create', addUser)

userRouter.put('/user/:id/status', updateUserStatus)

userRouter.put('/user/edit', editUser)

userRouter.delete('/user/delete', deleteUser)

export default userRouter