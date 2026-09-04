# koa-admin-server
后台管理系统后端服务，使用docker容器化部署
（配套前端项目：[universal-admin-system](https://github.com/huanganfree/universal-admin-system)）
## 完成的功能
- ✅ **鉴权与权限控制**
  - ✅ 基于 JWT (JSON Web Token) 的用户登录认证
  - ✅ 基于 RBAC (Role-Based Access Control) 的角色与菜单/接口权限管理
- ✅ **基础管理模块**
  - ✅ 内容管理（查看内容，编辑内容，提交审核内容，下线内容）
  - ✅ 待审核内容（通过内容，驳回内容）
  - ✅ 回收站（恢复内容，彻底删除内容）
- ✅ **系统管理模块**
  - ✅ 用户管理（增删改查、分页、分配角色、重置密码）
  - ✅ 角色管理（增删改查、分配菜单、按钮权限）
  - ✅ 菜单管理（动态菜单配置、支持嵌套路由）
- ✅ **工程化与服务治理**
  - ✅ nginx配置反向代理，隐藏生产真实接口地址
  - ✅ Docker 容器化部署方案（提供 Dockerfile & docker-compose 配置文件）
  - ✅ 全局错误捕获与统一响应格式封装
  - ✅ 日志管理与持久化落盘
