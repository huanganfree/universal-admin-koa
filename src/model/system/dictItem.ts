import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

 interface SysDictItemModel extends Model<InferAttributes<SysDictItemModel>, InferCreationAttributes<SysDictItemModel>> {
    id: CreationOptional<number>;
    item_text: string;
    item_value: string;
    dict_code: string;
    description: CreationOptional<string>;
}

function initDictItem(sequelize: Sequelize) {
    
    const SysDictItem = sequelize.define<SysDictItemModel>(
        'SysDictItem',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            item_text: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '文本'
            },
            item_value: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '值',
                unique: 'dict_code_item_value'
            },
            dict_code: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: '字典编码',
                unique: 'dict_code_item_value'
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: '描述'
            }
        },
        {
            tableName: 'sys_dict_item',
            paranoid: true,
        },
    )
    return SysDictItem
}

export {
    initDictItem
}