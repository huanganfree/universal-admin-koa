"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDictItem = initDictItem;
const sequelize_1 = require("sequelize");
function initDictItem(sequelize) {
    const SysDictItem = sequelize.define('SysDictItem', {
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        item_text: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '文本'
        },
        item_value: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '值',
            unique: 'dict_code_item_value'
        },
        dict_code: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: '字典编码',
            unique: 'dict_code_item_value'
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: '描述'
        }
    }, {
        tableName: 'sys_dict_item',
        paranoid: true,
    });
    return SysDictItem;
}
