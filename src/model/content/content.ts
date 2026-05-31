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
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '',
            },
            cover: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '封面图',
                defaultValue: ''
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