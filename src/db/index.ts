import { Sequelize } from 'sequelize';
import { initDict, initDictItem, initRole, initUser, initContent, initMenu } from '../model';
import { initRoleMenu } from '../model/system/role_menu';
import { requireEnv } from '../utils/envConfig';

const sequelize = new Sequelize(requireEnv('DB_NAME'), requireEnv('DB_USER'), requireEnv('DB_PASSWORD'), {
  host: requireEnv('DB_HOST'),
  dialect: 'mysql',
  timezone: '+08:00'
});

const User = initUser(sequelize)
const Role = initRole(sequelize)
const SysDict = initDict(sequelize)
const SysDictItem = initDictItem(sequelize)
const Content = initContent(sequelize)
const MenuModel = initMenu(sequelize)
const RoleMenuModel = initRoleMenu(sequelize)

User.belongsTo(Role, { foreignKey: 'roleId' });

Content.belongsTo(User, { foreignKey: 'createdBy', as: 'Creator' })
Content.belongsTo(User, { foreignKey: 'updatedBy', as: 'Updater' })

// 建立多对多关联
Role.belongsToMany(MenuModel, { through: RoleMenuModel, foreignKey: 'roleId', otherKey: 'menuId', as: 'menuModels' });
MenuModel.belongsToMany(Role, { through: RoleMenuModel, foreignKey: 'menuId', otherKey: 'roleId' });

export {
  sequelize,
  User,
  Role,
  SysDict,
  SysDictItem,
  Content,
  MenuModel,
  RoleMenuModel
}