"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUser = initUser;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
function initUser(sequelize) {
    const user = sequelize.define('User', {
        id: {
            type: sequelize_1.DataTypes.INET,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        avatar: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '手机号',
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '加密密码',
            defaultValue: '123456'
        },
        roleId: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: '角色id',
            references: {
                model: 'role',
                key: 'id'
            }
        },
        status: {
            type: sequelize_1.DataTypes.TINYINT,
            allowNull: false,
            comment: '禁用状态, 1启用 0禁用',
            defaultValue: 0,
            get() {
                return !!(this.getDataValue('status'));
            },
        },
        nickname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lastLoginTime: {
            type: sequelize_1.DataTypes.DATE,
            comment: '最后登录时间',
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('lastLoginTime');
                return rawValue ? (0, dayjs_1.default)(rawValue).format('YYYY-MM-DD HH:mm:ss') : null;
            },
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
        // freezeTableName: true,
        tableName: 'user',
        paranoid: true,
        // underscored: true,
        indexes: [
            {
                name: 'uk_username',
                unique: true,
                fields: ['username']
            },
            {
                name: 'uk_phone',
                unique: true,
                fields: ['phone']
            }
        ]
    });
    return user;
}
