"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMenuModel = exports.MenuModel = exports.Content = exports.SysDictItem = exports.SysDict = exports.Role = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const model_1 = require("../model");
const role_menu_1 = require("../model/system/role_menu");
const envConfig_1 = require("../utils/envConfig");
const sequelize = new sequelize_1.Sequelize((0, envConfig_1.requireEnv)('DB_NAME'), (0, envConfig_1.requireEnv)('DB_USER'), (0, envConfig_1.requireEnv)('DB_PASSWORD'), {
    host: (0, envConfig_1.requireEnv)('DB_HOST'),
    dialect: 'mysql',
    timezone: '+08:00'
});
exports.sequelize = sequelize;
const User = (0, model_1.initUser)(sequelize);
exports.User = User;
const Role = (0, model_1.initRole)(sequelize);
exports.Role = Role;
const SysDict = (0, model_1.initDict)(sequelize);
exports.SysDict = SysDict;
const SysDictItem = (0, model_1.initDictItem)(sequelize);
exports.SysDictItem = SysDictItem;
const Content = (0, model_1.initContent)(sequelize);
exports.Content = Content;
const MenuModel = (0, model_1.initMenu)(sequelize);
exports.MenuModel = MenuModel;
const RoleMenuModel = (0, role_menu_1.initRoleMenu)(sequelize);
exports.RoleMenuModel = RoleMenuModel;
User.belongsTo(Role, { foreignKey: 'roleId' });
Content.belongsTo(User, { foreignKey: 'createdBy', as: 'Creator' });
Content.belongsTo(User, { foreignKey: 'updatedBy', as: 'Updater' });
// 建立多对多关联
Role.belongsToMany(MenuModel, { through: RoleMenuModel, foreignKey: 'roleId', otherKey: 'menuId', as: 'menuModels' });
MenuModel.belongsToMany(Role, { through: RoleMenuModel, foreignKey: 'menuId', otherKey: 'roleId' });
