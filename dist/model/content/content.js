"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initContent = initContent;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
function initContent(sequelize) {
    const content = sequelize.define('Content', {
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        cover: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: '封面图',
            defaultValue: ''
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending', 'published', 'offline'),
            allowNull: false,
            comment: '状态',
            defaultValue: 'draft'
        },
        content: {
            type: sequelize_1.DataTypes.TEXT('long'),
            allowNull: false,
            comment: '内容',
        },
        reviewRemark: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: '备注',
        },
        createdBy: {
            type: sequelize_1.DataTypes.INET,
            allowNull: false,
            comment: '创建人',
            references: {
                model: 'user',
                key: 'id'
            }
        },
        updatedBy: {
            type: sequelize_1.DataTypes.INET,
            allowNull: false,
            comment: '修改人',
            references: {
                model: 'user',
                key: 'id'
            }
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
        // freezeTableName: true,
        tableName: 'content',
        underscored: true,
        paranoid: true,
    });
    return content;
}
