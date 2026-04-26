const Koa = require('koa');
const app = new Koa();
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})
require('./src/model/index')
require('./src/db/index')

console.log('当前环境==', process.env.DB_HOST)

app.use(async (ctx, next) => {
  console.log('1=');
});


app.on('error', err => {
  console.error('server error', err)
});

app.listen(process.env.PORT);