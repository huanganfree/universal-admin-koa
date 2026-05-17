import Router from '@koa/router';
import { addRole, deleteRoles, editRoles, getDictItem, getRoles, getUserInfo, updateRoleStatus } from "../controller/system.controller";

const router = new Router({ prefix:'/api/system' });

router.get('/userInfo', getUserInfo)  

// 字典
router.get('/dictItems', getDictItem)

// 角色
router.post('/role/create', addRole)
router.get('/roles/search', getRoles)
router.delete('/roles/delete', deleteRoles)
router.put('/role/edit', editRoles)
router.put('/role/:id/status', updateRoleStatus)

export default router