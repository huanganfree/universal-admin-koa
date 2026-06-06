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
                allowNull: false,
                comment: '封面图',
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
            createdBy: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: '创建人'
            },
            updatedBy: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: '修改人'
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
                    const raw = this.getDataValue('createdAt');
                    return raw ? dayjs(raw).format('YYYY-MM-DD HH:mm:ss') : null;
                }
            }
        },
        {
            // freezeTableName: true,
            tableName: 'content',
            underscored: true,
        },
    )
    return content
}

export {
    initContent
}