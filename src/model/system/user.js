const { DataTypes } = require('sequelize');
const {sequelize} = require('../../db/index')

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '加密密码'
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastLoginTime: {
          type: DataTypes.DATE,
          comment: '最后登录时间'
        }
    },
    {
        // freezeTableName: true,
        tableName: 'user',
    },
);

module.exports = {
    User
}