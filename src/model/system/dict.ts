import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

 interface ModelType extends Model<InferAttributes<ModelType>, InferCreationAttributes<ModelType>> {
    id: CreationOptional<number>;
    dict_name: string;
    dict_code: string;
    description: CreationOptional<string>;
}

function initDict(sequelize: Sequelize) {
    
    const SysDict = sequelize.define<ModelType>(
        'SysDict',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            dict_name: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '字典名称'
            },
            dict_code: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '字典编码',
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: '描述'
            }
        },
        {
            tableName: 'sys_dict',
            paranoid: true,
        },
    )
    return SysDict
}

export {
    initDict
}