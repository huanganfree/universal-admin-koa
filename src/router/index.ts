import Koa from 'koa';
import AuthRouter from './auth';
import SystemRouter from './system/systemRouter';
import UserRouter from './system/userRouter';

export function mountRouters(app: Koa) {
    app.use(AuthRouter.routes()).use(AuthRouter.allowedMethods())
    app.use(SystemRouter.routes()).use(SystemRouter.allowedMethods())
    app.use(UserRouter.routes()).use(UserRouter.allowedMethods())
}