"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 对用户密码加密
const crypto_1 = __importDefault(require("crypto"));
const secret = 'news_admin_2026_secret';
function cryptoPwd(pwd) {
    const hmac = crypto_1.default.createHmac('sha256', secret);
    hmac.update(pwd);
    return hmac.digest('hex');
}
module.exports = {
    cryptoPwd
};
