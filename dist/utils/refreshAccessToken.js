"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshAccessToken = getRefreshAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getRefreshAccessToken({ phone, id, roleId }) {
    return jsonwebtoken_1.default.sign({ userId: id, phone: phone, roleId: roleId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
