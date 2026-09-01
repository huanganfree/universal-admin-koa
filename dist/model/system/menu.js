"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMenu = initMenu;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
function initMenu(sequelize) {
    const menuModel = sequelize.define('Menu', {
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        parentId: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: '父级菜单id',
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '菜单名称'
        },
        type: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['1', '2'],
            allowNull: false,
            comment: '类型;1是菜单，2是按钮'
        },
        icon: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        path: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        component: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        permission: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        sort: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.TINYINT,
            allowNull: true,
            comment: '禁用状态, 1启用 0禁用',
            defaultValue: 0
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
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            get() {
                const raw = this.getDataValue('deletedAt');
                return raw ? (0, dayjs_1.default)(raw).format('YYYY-MM-DD HH:mm:ss') : null;
            }
        }
    }, {
        tableName: 'menu',
        underscored: true,
        paranoid: true,
        indexes: [
            {
                name: 'uk_parent_name',
                unique: true,
                fields: ['parent_id', 'name'] // 联合唯一索引
            }
        ]
    });
    return menuModel;
}
