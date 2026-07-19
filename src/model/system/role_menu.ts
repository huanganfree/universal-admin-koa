import dayjs from 'dayjs';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export interface RoleMenuType extends Model<InferAttributes<RoleMenuType>, InferCreationAttributes<RoleMenuType>> {
    id: number;
    roleId: number;
    menuId: number;
    [key: string]: any
}

function initRoleMenu(sequelize: Sequelize) {

    const roleMenuModel = sequelize.define<RoleMenuType>(
        'RoleMenu',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            roleId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                comment: '角色id'
            },
            menuId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                comment: '菜单id'
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
        }
    )

    return roleMenuModel
}

export {
    initRoleMenu
}