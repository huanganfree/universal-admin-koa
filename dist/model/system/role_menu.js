"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoleMenu = initRoleMenu;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
function initRoleMenu(sequelize) {
    const roleMenuModel = sequelize.define('RoleMenu', {
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        roleId: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: '角色id'
        },
        menuId: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: '菜单id'
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
        tableName: 'role_menu',
        underscored: true,
        paranoid: false,
        indexes: [
            {
                name: 'uk_role_menu',
                unique: true,
                fields: ['role_id', 'menu_id']
            }
        ]
    });
    return roleMenuModel;
}
