import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

 interface ModelType extends Model<InferAttributes<ModelType>, InferCreationAttributes<ModelType>> {
    id: CreationOptional<number>;
    roleName: CreationOptional<string>;
    roleCode: CreationOptional<string>;
    description: CreationOptional<string>;
    status: CreationOptional<number>;
    createdBy: CreationOptional<number>;
    updatedBy: CreationOptional<number>
}

function initRole(sequelize: Sequelize) {
    
    const role = sequelize.define<ModelType>(
        'Role',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            roleName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roleCode: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '角色标识',
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: '角色描述'
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: true,
                comment: '禁用状态, 1启用 0禁用',
                defaultValue: 0
            },
            createdBy: {
                type: DataTypes.BIGINT,
                allowNull: true,

            },
            updatedBy: {
                type: DataTypes.BIGINT,
                allowNull: true,
            }
        },
        {
            tableName: 'role',
            paranoid: true
        },
    )
    return role
}

export {
    initRole
}