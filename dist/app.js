"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const bodyparser_1 = require("@koa/bodyparser");
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const db_1 = require("./db");
const index_1 = require("./router/index");
const error_middleware_1 = require("./middleware/error.middleware");
const node_path_1 = __importDefault(require("node:path"));
console.log('当前环境==', process.env.DB_HOST);
const app = new koa_1.default();
// 拦截
app.use(async (ctx, next) => {
    if (ctx.path === '/favicon.ico') {
        ctx.status = 204;
        return;
    }
    await next();
});
app.use((0, koa_mount_1.default)('/uploads', (0, koa_static_1.default)(node_path_1.default.join(__dirname, '../uploads'))));
app.use((0, koa_jwt_1.default)({ secret: process.env.JWT_ACCESS_SECRET }).unless({ path: [/\/api\/auth\/login$/, /\/uploads/, /\/api\/auth\/refresh$/, /\/api\/auth\/logout$/] })); // 跳过登录
app.use(error_middleware_1.errorMiddleware);
app.use((0, bodyparser_1.bodyParser)({
    parsedMethods: ['DELETE', 'POST', 'PUT', 'PATCH']
}));
(0, index_1.mountRouters)(app);
// 这里进行关联查询，或者执行同步
async function bootstrap() {
    await db_1.sequelize.authenticate();
    console.log('test === Connection has been established successfully.');
    // await sequelize.sync({ force: false, match: /^koa_news_admin$/, alter: true })
    app.listen(process.env.PORT);
    app.on('error', err => {
        console.error('server error', err);
    });
}
bootstrap();
