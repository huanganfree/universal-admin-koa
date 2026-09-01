"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDict = initDict;
const sequelize_1 = require("sequelize");
function initDict(sequelize) {
    const SysDict = sequelize.define('SysDict', {
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        dict_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '字典名称'
        },
        dict_code: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '字典编码',
            unique: 'dict_code',
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: '描述'
        }
    }, {
        tableName: 'sys_dict',
        paranoid: true,
    });
    return SysDict;
}
