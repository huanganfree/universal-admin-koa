"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: '127.0.0.1',
    port: 6379,
    // password: 'your_password',
});
exports.redis = redis;
redis.on('connect', () => {
    console.log('Redis 连接成功！');
});
redis.on('error', (err) => {
    console.error('Redis 连接出错:', err);
});
