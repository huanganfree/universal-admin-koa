import dayjs from 'dayjs';
import { DataTypes, Sequelize } from 'sequelize';

function initUser(sequelize: Sequelize) {
    const user = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INET,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '手机号',
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '加密密码',
                defaultValue: '123456'
            },
            roleId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                comment: '角色id',
                references: {
                    model: 'role',
                    key: 'id'
                }
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                comment: '禁用状态, 1启用 0禁用',
                defaultValue: 0,
                get() {
                    return !!(this.getDataValue('status'))
                },
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastLoginTime: {
                type: DataTypes.DATE,
                comment: '最后登录时间',
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('lastLoginTime');
                    return rawValue ? dayjs(rawValue).format('YYYY-MM-DD HH:mm:ss') : null;
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                get() {
                    const raw = this.getDataValue('createdAt');
                    return raw ? dayjs(raw).format('YYYY-MM-DD HH:mm:ss') : null;
                }
            },
            updatedAt: {
                type: DataTypes.DATE,
                get() {
                    const raw = this.getDataValue('updatedAt');
                    return raw ? dayjs(raw).format('YYYY-MM-DD HH:mm:ss') : null;
                }
            }
        },
        {
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
        }
    )
    return user
}

export {
    initUser
}