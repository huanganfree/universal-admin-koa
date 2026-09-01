"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireEnv = requireEnv;
function requireEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing environment variable: ${name}`);
    return value;
}
