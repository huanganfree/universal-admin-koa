import dayjs from 'dayjs';
import { CreationOptional, DataTypes, ENUM, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export interface MenuType extends Model<InferAttributes<MenuType>, InferCreationAttributes<MenuType>> {
    id: CreationOptional<number>;
    parentId: number | null;
    name: string;
    type: '1' | '2'; // 菜单和按钮，暂时两种
    icon: string | null;
    path: string | null;
    component: string | null;
    permission: string | null;
    sort: number,
    [key: string]: any
}

function initMenu(sequelize: Sequelize) {

    const menuModel = sequelize.define<MenuType>(
        'Menu',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            parentId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
                comment: '父级菜单id',
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '菜单名称'
            },
            type: {
                type: DataTypes.ENUM,
                values: ['1', '2'],
                allowNull: false,
                comment: '类型;1是菜单，2是按钮'
            },
            icon: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            path: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            component: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            permission: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            sort: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: true,
                comment: '禁用状态, 1启用 0禁用',
                defaultValue: 0
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
            tableName: 'menu',
            underscored: true,
            paranoid: true,
            indexes: [
                {
                    name: 'uk_parent_name',
                    unique: true,
                    fields: ['parent_id', 'name']   // 联合唯一索引
                }
            ]
        },
    )

    return menuModel

}

export {
    initMenu
}