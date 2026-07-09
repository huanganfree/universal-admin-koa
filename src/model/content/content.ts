import dayjs from 'dayjs';
import { DataTypes, Sequelize } from 'sequelize';

function initContent(sequelize: Sequelize) {
    const content = sequelize.define(
        'Content',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tags: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            cover: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: '封面图',
                defaultValue: ''
            },
            status: {
                type: DataTypes.ENUM('draft', 'pending', 'published', 'offline'),
                allowNull: false,
                comment: '状态',
                defaultValue: 'draft'
            },
            content: {
                type: DataTypes.TEXT('long'),
                allowNull: false,
                comment: '内容',
            },
            reviewRemark: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: '备注',
            },
            createdBy: {
                type: DataTypes.INET,
                allowNull: false,
                comment: '创建人',
                references: {
                    model: 'user',
                    key: 'id'
                }
            },
            updatedBy: {
                type: DataTypes.INET,
                allowNull: false,
                comment: '修改人',
                references: {
                    model: 'user',
                    key: 'id'
                }
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
            },
            deletedAt: {
                type: DataTypes.DATE,
                get() {
                    const raw = this.getDataValue('deletedAt');
                    return raw ? dayjs(raw).format('YYYY-MM-DD HH:mm:ss') : null;
                }
            }
        },
        {
            // freezeTableName: true,
            tableName: 'content',
            underscored: true,
            paranoid: true,
        },
    )
    return content
}

export {
    initContent
}