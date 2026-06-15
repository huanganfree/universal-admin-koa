import { Sequelize } from 'sequelize';
import { initDict, initDictItem, initRole, initUser, initContent } from '../model';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const sequelize = new Sequelize(requireEnv('DB_NAME'), requireEnv('DB_USER'), requireEnv('DB_PASSWORD'), {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '+08:00'
});

const User = initUser(sequelize)
const Role = initRole(sequelize)
const SysDict = initDict(sequelize)
const SysDictItem = initDictItem(sequelize)
const Content = initContent(sequelize)

// 配置关联关系
User.belongsTo(Role, { foreignKey: 'roleId' });

Content.belongsTo(User, { foreignKey: 'createdBy', as: 'Creator'})
Content.belongsTo(User, { foreignKey: 'updatedBy', as: 'Updater'})

export {
  sequelize,
  User,
  Role,
  SysDict,
  SysDictItem,
  Content
}