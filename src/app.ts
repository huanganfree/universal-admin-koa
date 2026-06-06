import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import jwt from 'koa-jwt';
import serve from 'koa-static';
import mount from 'koa-mount';

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

import { sequelize } from './db';
import { mountRouters } from './router/index';
import { errorMiddleware } from './middleware/error.middleware';
import path from 'node:path';

console.log('当前环境==', process.env.DB_HOST)

const app = new Koa();

// 1. 必须放在第一位！一进门就拦截
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    ctx.status = 204;
    return;
  }
  await next();
});

app.use(mount('/uploads', serve(path.join(__dirname, '../uploads'))));

app.use(jwt({ secret: process.env.JWT_SECRET! }).unless({ path: [/^\/api\/auth\/login$/, /^\/uploads/] }));// 跳过登录

app.use(errorMiddleware);

app.use(bodyParser({
  parsedMethods: ['DELETE', 'POST', 'PUT', 'PATCH']
}));

mountRouters(app)

// 你可以在这里进行关联查询，或者执行同步
async function bootstrap() {
  await sequelize.authenticate();
  console.log('test === Connection has been established successfully.');
  await sequelize.sync({ force: false, match: /^koa_news_admin$/, alter: true })
  app.listen(process.env.PORT);

  app.on('error', err => {
    console.error('server error', err)
  });
}

bootstrap();

