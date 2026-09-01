"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRole = initRole;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
function initRole(sequelize) {
    const role = sequelize.define('Role', {
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        roleName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        roleCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '角色标识',
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: '角色描述'
        },
        status: {
            type: sequelize_1.DataTypes.TINYINT,
            allowNull: true,
            comment: '禁用状态, 1启用 0禁用',
            defaultValue: 0
        },
        createdBy: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
        },
        updatedBy: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            get() {
                const raw = this.getDataValue('createdAt');
                return raw ? (0, dayjs_1.default)(raw).format('YYYY-MM-DD HH:mm:ss') : null;
            }
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            get() {
                const raw = this.getDataValue('updatedAt');
                return raw ? (0, dayjs_1.default)(raw).format('YYYY-MM-DD HH:mm:ss') : null;
            }
        }
    }, {
        tableName: 'role',
        paranoid: true,
        indexes: [
            {
                name: 'uk_roleName',
                fields: ['roleName'],
                unique: true
            },
            {
                name: 'uk_roleCode',
                fields: ['roleCode'],
                unique: true
            }
        ]
    });
    return role;
}
