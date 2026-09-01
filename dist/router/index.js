"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountRouters = mountRouters;
const auth_1 = __importDefault(require("./auth"));
const systemRouter_1 = __importDefault(require("./system/systemRouter"));
const userRouter_1 = __importDefault(require("./system/userRouter"));
const contentRouter_1 = __importDefault(require("./content/contentRouter"));
const menuRouter_1 = __importDefault(require("./system/menuRouter"));
function mountRouters(app) {
    app.use(auth_1.default.routes()).use(auth_1.default.allowedMethods());
    app.use(systemRouter_1.default.routes()).use(systemRouter_1.default.allowedMethods());
    app.use(userRouter_1.default.routes()).use(userRouter_1.default.allowedMethods());
    app.use(contentRouter_1.default.routes()).use(contentRouter_1.default.allowedMethods());
    app.use(menuRouter_1.default.routes()).use(menuRouter_1.default.allowedMethods());
}
