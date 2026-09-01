"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
exports.dbConfig = {
    host: 'localhost', // 生产和开发环境都是该地址
    port: '3306',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 10, // 设置连接池中的最大连接数
    connectTimeout: 15000
};
