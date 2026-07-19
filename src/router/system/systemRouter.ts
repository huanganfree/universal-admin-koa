import Router from '@koa/router';
import { addRole, deleteRoles, editRoles, getDictItem, getRoleAuth, getRoles, getUserInfo, updateRoleAuth, updateRoleStatus } from "../../controller/system/system.controller";

const router = new Router({ prefix:'/api/system' });

// 登录用户信息
router.get('/userInfo', getUserInfo)  

// 字典
router.get('/dictItems', getDictItem)

// 角色CRUD
router.post('/role/create', addRole)
router.get('/roles/search', getRoles)
router.delete('/roles/delete', deleteRoles)
router.put('/role/edit', editRoles)
router.put('/role/:id/status', updateRoleStatus)

// 角色权限
router.put('/role/:id/auth', updateRoleAuth)
router.get('/role/auth', getRoleAuth)

export default router